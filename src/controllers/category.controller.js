const Category = require('../models/category.model');
const mongoose = require('mongoose');
const isValidObjectId = require('../utils/helper/validateObjectId');
const News = require('../models/news.model');
const { validateTag } = require('../schema-validation/tag.validation');
const bodyParser = require('../utils/helper/bodyParser');



// Get all categories
const getAll = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        if (!categories.length) {
            return res.status(404).send({
                message: 'No categories found',
                data: [],
            });
        }

        res.status(200).send({
            message: 'Categories fetched successfully',
            data: categories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'An error occurred while fetching categories.',
            error: error.message,
        });
    }
};

// Get a single category by ID
const getSingle = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).send({
                message: 'Invalid Category ID format',
            });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).send({
                message: 'Category not found',
            });
        }

        const mappedWithNews = await News.findOne({ category: id });

        if (mappedWithNews) {
            return res.status(400).send({
                message: 'Category is associated with news. Cannot delete.',
            });
        }

        res.status(200).send({
            message: 'Category fetched successfully',
            data: category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'An error occurred while fetching the category.',
            error: error.message,
        });
    }
};

// Create a new category
const create = async (req, res) => {
    try {

        if (!request.isMultipart()) {
            return reply
                .status(422)
                .send({ error: "Request must be multipart/form-data" });
        }

        let fields = await bodyParser(request, '/public/storage/news');

        const validationResponse = await validateTag(fields, reply);
        if (validationResponse) return;

        const { name } = fields;

        const category = await Category.create({ name });

        res.status(201).send({
            message: 'Category created successfully.',
            data: category,
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

        if (error.code === 11000) {
            return res.status(400).send({
                message: 'Category name must be unique.',
            });
        }

        res.status(500).send({
            message: 'An error occurred while creating the category.',
            error: error.message,
        });
    }
};

// Update a category by ID
const update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).send({
                message: 'Invalid Category ID format',
            });
        }

        const category = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            return res.status(404).send({
                message: 'Category not found.',
            });
        }

        res.status(200).send({
            message: 'Category updated successfully.',
            data: category,
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
            message: 'An error occurred while updating the category.',
            error: error.message,
        });
    }
};

// Delete a category by ID
const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).send({
                message: 'Invalid Category ID format',
            });
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).send({
                message: 'Category not found.',
            });
        }

        res.status(200).send({
            message: 'Category deleted successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'An error occurred while deleting the category.',
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