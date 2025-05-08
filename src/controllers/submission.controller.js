const Submission = require('../models/submission.model');
const mongoose = require('mongoose');
const bodyParser = require('../utils/helper/bodyParser');
const { validateNews } = require('../schema-validation/news.validation');
const { validateSubmission } = require('../schema-validation/submission.validation');

const getAll = async (request, reply) => {
    try {
        const { message, mobile, name, email, title } = request.query;

        const query = {};

        const stringSearch = (query, filter) => {
            if (filter) {
                query.name = { $regex: filter, $options: 'i' };
            }
        }

        stringSearch(query, name);
        stringSearch(query, message);
        stringSearch(query, mobile);
        stringSearch(query, email);
        stringSearch(query, title);

        // Fetch news with filters and populate related fields
        const submissions = await Submission.find(query).sort({ createdAt: -1 });

        if (!submissions || submissions.length === 0) {
            return reply.status(404).send({
                message: 'No Submissions found',
                data: []
            });
        }

        reply.status(200).send({
            message: 'Submissions fetched successfully',
            data: submissions
        });

    } catch (error) {
        console.error(error);
        reply.status(500).send({
            message: 'An error occurred while fetching the Submissions.',
            error: error.message
        });
    }
};

const getSingle = async (request, reply) => {
    try {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.status(400).send({
                message: 'Invalid submission ID format'
            });
        }

        const submission = await Submission.findById(id);

        if (!submission) {
            return reply.status(404).send({
                message: 'Submission not found'
            });
        }

        reply.status(200).send({
            message: 'Submission fetched successfully',
            data: submission
        });

    } catch (error) {
        console.error(error);
        reply.status(500).send({
            message: 'An error occurred while fetching the submission.',
            error: error.message
        });
    }
};

const create = async (request, reply) => {
    try {
        if (!request.isMultipart()) {
            return reply.status(422).send({ error: "Request must be multipart/form-data" });
        }

        let fields = await bodyParser(request);

        const validationResponse = await validateSubmission(fields, reply);
        if (validationResponse) return;

        const {
            name,
            mobile,
            email,
            title,
            message
        } = fields;

        const submission = await Submission.create({
            name,
            mobile,
            email,
            title,
            message
        });

        reply.status(201).send({
            message: 'Submission created successfully',
            data: submission
        });

    } catch (error) {
        console.error(error);
        reply.status(500).send({
            message: 'Failed to create submission',
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

        if (fields?.image) {
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
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.status(400).send({
                message: 'Invalid submssion ID format'
            });
        }

        const submission = await Submission.findByIdAndDelete(id);

        if (!submission) {
            return reply.status(404).send({
                message: 'Submission not found'
            });
        }

        reply.status(200).send({
            message: 'Submission deleted successfully'
        });

    } catch (error) {
        console.error(error);
        reply.status(500).send({
            message: 'An error occurred while deleting the submission.',
            error: error.message
        });
    }
};

module.exports = {
    getAll,
    getSingle,
    create,
    update,
    destroy
};
