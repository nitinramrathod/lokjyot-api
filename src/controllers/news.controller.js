const News = require('../models/news.model');
const mongoose = require('mongoose');
const bodyParser = require('../utils/helper/bodyParser');
const { validateNews } = require('../schema-validation/news.validation');


const getAll = async (request, reply) => {
  try {
    const {
      category,
      tags,
      name,
      type,
      location,
      publisher,
      author_name,
      start_date,
      end_date
    } = request.query;

    const query = { status: "active" };

    // Type filter
    if (type) {
      query.type = type;
    }

    // Category filter
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = {
        $in: tagArray
          .filter(tag => mongoose.Types.ObjectId.isValid(tag))
          .map(tag => mongoose.Types.ObjectId(tag))
      };
    }

    // Name filter (partial match, case-insensitive)
   if (name) {
    query.$or = [
        { name: { $regex: name, $options: 'i' } },
        { short_description: { $regex: name, $options: 'i' } }
    ];
    }

    // Location filter (partial match)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Publisher filter
    if (publisher && mongoose.Types.ObjectId.isValid(publisher)) {
      query.publisher = publisher;
    }

    // Author name filter
    if (author_name) {
      query.author_name = { $regex: author_name, $options: 'i' };
    }

    // Publish date range filter
    if (start_date || end_date) {
      query.publish_date = {};
      if (start_date) {
        query.publish_date.$gte = new Date(start_date);
      }
      if (end_date) {
        query.publish_date.$lte = new Date(end_date);
      }
    }

    const news = await News.find(query)
      .populate('category', 'name') // Populate category name
      .populate('tags', 'name')     // Populate tag names
      .populate('publisher', 'name') // Optional: Populate publisher (User)
      .sort({ createdAt: -1 });

    if (!news.length) {
      return reply.status(404).send({
        message: 'No news found',
        data: []
      });
    }

    reply.status(200).send({
      message: 'News fetched successfully',
      data: news
    });

  } catch (error) {
    console.error(error);
    reply.status(500).send({
      message: 'An error occurred while fetching the news.',
      error: error.message
    });
  }
}; 

const adminGetAll = async (request, reply) => {
    try {
        const { category, tags, name, status, type } = request.query;

        const query = {};

        const user = request.user;

        // Build query filters
        if (type) {
            query.type = type;
        }
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            query.category = category;
        }
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            query.tags = { $in: tagArray.map(tag => mongoose.Types.ObjectId(tag)) };
        }
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }
        if (status) {
            query.status = status;
        }

        if (user.role === 'publisher') {
            query.publisher = user._id; // Assuming 'createdBy' is the field that stores the user ID who created the news
        }

        // Fetch news with filters and populate related fields
        const news = await News.find(query)
            .populate('category', 'name') // Populate category name
            .populate('tags', 'name') // Populate tag names
            .sort({ createdAt: -1 }).exec();;

        if (!news || news.length === 0) {
            return reply.status(404).send({
                message: 'No news found',
                data: []
            });
        }

        reply.status(200).send({
            message: 'News fetched successfully',
            data: news
        });

    } catch (error) {
        console.error(error);
        reply.status(500).send({
            message: 'An error occurred while fetching the news.',
            error: error.message
        });
    }
};

const getSingle = async (request, reply) => {
    try {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.status(400).send({
                message: 'Invalid News ID format'
            });
        }

        const news = await News.findById(id)
            .populate('category', 'name') // Populate category name
            .populate('tags', 'name')
            .populate('publisher', 'name');// Populate tag names

        if (!news) {
            return reply.status(404).send({
                message: 'News not found'
            });
        }

        reply.status(200).send({
            message: 'News fetched successfully',
            data: news
        });

    } catch (error) {
        console.error(error);
        reply.status(500).send({
            message: 'An error occurred while fetching the news.',
            error: error.message
        });
    }
};

const create = async (request, reply) => {
    try {

        if (!request.isMultipart()) {
            return reply
                .status(422)
                .send({ error: "Request must be multipart/form-data" });
        }

        let fields = await bodyParser(request, '/public/storage/news');      

        let extracted_tags = Object.keys(fields)
            .filter((key) => key.startsWith("tags["))
            .sort((a, b) => {
                const indexA = parseInt(a.match(/\[(\d+)\]/)[1], 10);
                const indexB = parseInt(b.match(/\[(\d+)\]/)[1], 10);
                return indexA - indexB;
            })
            .map((key) => fields[key]);

        //Map keys

        fields.tags = extracted_tags;

        if(fields?.image){
            fields.image = fields?.image;
        }

        const validationResponse = await validateNews(fields, reply);
        if (validationResponse) return;

        const {
            name,
            author_name,
            short_description,
            long_description,
            publish_date,
            location,
            image,
            category,
            tags,
            type,
            status
        } = fields;

        const publisher = request?.user?.userId;

        // Validate category and tags as ObjectIds
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return reply.status(400).send({
                message: 'Invalid category ID'
            });
        }
        if (!mongoose.Types.ObjectId.isValid(publisher)) {
            return reply.status(400).send({
                message: 'Invalid publisher ID'
            });
        }
        if (!Array.isArray(tags) || !tags.every(tag => mongoose.Types.ObjectId.isValid(tag))) {
            return reply.status(400).send({
                message: 'Invalid tag IDs'
            });
        }

        const news = await News.create({
            name,
            author_name,
            short_description,
            long_description,
            publish_date,
            image,
            location,
            category,
            tags,
            status,
            type,
            publisher
        });

        reply.status(201).send({
            message: 'News created successfully',
            data: news
        });

    } catch (error) {
        console.error(error);
        reply.status(500).send({
            message: 'Failed to create news',
            error: error.message
        });
    }
};

const update = async (request, reply) => {
    try {

        if (!request.isMultipart()) {
            return reply
                .status(422)
                .send({ error: "Request must be multipart/form-data" });
        }

        let fields = await bodyParser(request, '/public/storage/news');

        let extracted_tags = Object.keys(fields)
            .filter((key) => key.startsWith("tags["))
            .sort((a, b) => {
                const indexA = parseInt(a.match(/\[(\d+)\]/)[1], 10);
                const indexB = parseInt(b.match(/\[(\d+)\]/)[1], 10);
                return indexA - indexB;
            })
            .map((key) => fields[key]);

        //Map keys

        fields.tags = extracted_tags;

        if(fields?.image){
            fields.image = fields?.image;
        }

        const validationResponse = await validateNews(fields, reply);
        if (validationResponse) return;

        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.status(400).send({
                message: 'Invalid News ID format'
            });
        }

        // Validate category and tags if provided
        if (fields.category && !mongoose.Types.ObjectId.isValid(fields.category)) {
            return reply.status(400).send({
                message: 'Invalid category ID'
            });
        }
        if (fields.tags && (!Array.isArray(fields.tags) || !fields.tags.every(tag => mongoose.Types.ObjectId.isValid(tag)))) {
            return reply.status(400).send({
                message: 'Invalid tag IDs'
            });
        }

        const updatedNews = await News.findByIdAndUpdate(id, fields, {
            new: true,
            runValidators: true
        }).populate('category', 'name').populate('tags', 'name'); // Populate updated tag names

        if (!updatedNews) {
            return reply.status(404).send({
                message: 'News not found'
            });
        }

        reply.status(200).send({
            message: 'News updated successfully',
            data: updatedNews
        });

    } catch (error) {
        console.error(error);
        reply.status(500).send({
            message: 'An error occurred while updating the news.',
            error: error.message
        });
    }
};

const destroy = async (request, reply) => {
    try {
        if (!request.isMultipart()) {
            return reply
                .status(422)
                .send({ error: "Request must be multipart/form-data" });
        }

        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.status(400).send({
                message: 'Invalid News ID format'
            });
        }

        const news = await News.findByIdAndDelete(id);

        if (!news) {
            return reply.status(404).send({
                message: 'News not found'
            });
        }

        reply.status(200).send({
            message: 'News deleted successfully'
        });

    } catch (error) {
        console.error(error);
        reply.status(500).send({
            message: 'An error occurred while deleting the news.',
            error: error.message
        });
    }
};

const changeStatus = async (request, reply) => {
    try {
        if (!request.isMultipart()) {
            return reply
                .status(422)
                .send({ error: "Request must be multipart/form-data" });
        }

        let fields = await bodyParser(request, '/public/news');

        const { id } = request.params;
        const { status } = fields;

        // Validate News ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.status(400).send({
                message: 'Invalid News ID format',
            });
        }

        // Validate the new status
        const validStatuses = ["active", "inactive", "pending", "rejected"];
        if (!validStatuses.includes(status)) {
            return reply.status(400).send({
                message: `Invalid status. Allowed statuses are: ${validStatuses.join(', ')}`,
            });
        }

        // Update the status of the news
        const updatedNews = await News.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true } // Return updated document and validate
        );

        if (!updatedNews) {
            return reply.status(404).send({
                message: 'News not found',
            });
        }

        reply.status(200).send({
            message: 'News status updated successfully',
            data: updatedNews,
        });
    } catch (error) {
        console.error(error);
        reply.status(500).send({
            message: 'An error occurred while updating the news status.',
            error: error.message,
        });
    }
};

module.exports = {
    getAll,
    getSingle,
    create,
    update,
    destroy,
    changeStatus,
    adminGetAll
};
