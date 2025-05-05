const News = require('../models/news.model');
const mongoose = require('mongoose');

const getAll = async (request, reply) => {
    try {
        const { category, tags, name, type } = request.query;

        const query = { status: "active", type};

        // Build query filters
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

        // Fetch news with filters and populate related fields
        const news = await News.find(query)
            .populate('category', 'name') // Populate category name
            .populate('tags', 'name') // Populate tag names
            .sort({ createdAt: -1 });

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
const adminGetAll = async (request, reply) => {
    try {
        const { category, tags, name, status, type } = request.query;

        const query = {};

        const user = request.user;

        // Build query filters
        if(type){
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
            .populate('tags', 'name'); // Populate tag names

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

const create = async (req, res) => {
    try {
        const {
            name,
            author_name,
            short_description,
            long_description,
            publish_date,
            location,
            image_url,
            category,
            tags,
            type,
            status
        } = req.body;

        const publisher = req?.user?.userId;

        // Validate category and tags as ObjectIds
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).send({
                message: 'Invalid category ID'
            });
        }
        if (!mongoose.Types.ObjectId.isValid(publisher)) {
            return res.status(400).send({
                message: 'Invalid publisher ID'
            });
        }
        if (!Array.isArray(tags) || !tags.every(tag => mongoose.Types.ObjectId.isValid(tag))) {
            return res.status(400).send({
                message: 'Invalid tag IDs'
            });
        }

        const news = await News.create({
            name,
            author_name,
            short_description,
            long_description,
            publish_date,
            image_url,
            location,
            category,
            tags,
            status,
            type,
            publisher
        });

        res.status(201).send({
            message: 'News created successfully',
            data: news
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Failed to create news',
            error: error.message
        });
    }
};

const update = async (request, reply) => {
    try {
        const { id } = request.params;
        const updateData = request.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.status(400).send({
                message: 'Invalid News ID format'
            });
        }

        // Validate category and tags if provided
        if (updateData.category && !mongoose.Types.ObjectId.isValid(updateData.category)) {
            return reply.status(400).send({
                message: 'Invalid category ID'
            });
        }
        if (updateData.tags && (!Array.isArray(updateData.tags) || !updateData.tags.every(tag => mongoose.Types.ObjectId.isValid(tag)))) {
            return reply.status(400).send({
                message: 'Invalid tag IDs'
            });
        }

        const updatedNews = await News.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        })
            .populate('category', 'name') // Populate updated category name
            .populate('tags', 'name'); // Populate updated tag names

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
        const { id } = request.params;
        const { status } = request.body;

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
