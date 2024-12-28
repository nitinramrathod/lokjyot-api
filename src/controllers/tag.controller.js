const Tag = require('../models/tag.model');
const mongoose = require('mongoose');
const isValidObjectId = require('../utils/helper/validateObjectId');

// Get all tags
const getAll = async (req, res) => {
    try {
        const tags = await Tag.find().sort({ createdAt: -1 });

        if (!tags.length) {
            return res.status(404).send({
                message: 'No tags found',
                data: [],
            });
        }

        res.status(200).send({
            message: 'Tags fetched successfully',
            data: tags,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'An error occurred while fetching tags.',
            error: error.message,
        });
    }
};

// Get a single tag by ID
const getSingle = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).send({
                message: 'Invalid Tag ID format',
            });
        }

        const tag = await Tag.findById(id);

        if (!tag) {
            return res.status(404).send({
                message: 'Tag not found',
            });
        }

        res.status(200).send({
            message: 'Tag fetched successfully',
            data: tag,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'An error occurred while fetching the tag.',
            error: error.message,
        });
    }
};

// Create a new tag
const create = async (req, res) => {
    try {
        const { name } = req.body;

        const tag = await Tag.create({ name });

        res.status(201).send({
            message: 'Tag created successfully.',
            data: tag,
        });
    } catch (error) {
        console.error(error);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.fromEntries(
                Object.values(error.errors).map(err => [err.path, err.message])
            );

            return res.status(400).send({
                message: 'Validation failed',
                errors: validationErrors,
            });
        }

        res.status(500).send({
            message: 'An error occurred while creating the tag.',
            error: error.message,
        });
    }
};

// Update a tag by ID
const update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).send({
                message: 'Invalid Tag ID format',
            });
        }

        const tag = await Tag.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!tag) {
            return res.status(404).send({
                message: 'Tag not found.',
            });
        }

        res.status(200).send({
            message: 'Tag updated successfully.',
            data: tag,
        });
    } catch (error) {
        console.error(error);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.fromEntries(
                Object.values(error.errors).map(err => [err.path, err.message])
            );

            return res.status(400).send({
                message: 'Validation failed',
                errors: validationErrors,
            });
        }

        res.status(500).send({
            message: 'An error occurred while updating the tag.',
            error: error.message,
        });
    }
};

// Delete a tag by ID
const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).send({
                message: 'Invalid Tag ID format',
            });
        }

        const tag = await Tag.findByIdAndDelete(id);

        if (!tag) {
            return res.status(404).send({
                message: 'Tag not found.',
            });
        }

        res.status(200).send({
            message: 'Tag deleted successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'An error occurred while deleting the tag.',
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
};