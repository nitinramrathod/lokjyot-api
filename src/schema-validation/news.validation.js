const Joi = require('joi');
const { handleValidationError } = require('../utils/helper/validationErrorMessage');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid', { message: 'Invalid ObjectId format' });
    }
    return value;
};

// Joi schema for validating News data
const newsValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.base': 'Name should be a valid string.',
            'string.min': 'Name should be at least 3 characters long.',
            'string.max': 'Name should not exceed 200 characters.',
            'string.empty': 'Name cannot be empty.',
            'any.required': 'Name is required.',
        }),
    author_name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': 'Author name should be a valid string.',
            'string.min': 'Author name should be at least 3 characters long.',
            'string.max': 'Author name should not exceed 100 characters.',
            'string.empty': 'Author name cannot be empty.',
            'any.required': 'Author name is required.',
        }),
    publish_date: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': 'Publish date must be a valid date.',
            'date.format': 'Publish date must be in ISO 8601 format.',
            'any.required': 'Publish date is required.',
        }),
    image_url: Joi.string()
        .uri()
        .optional()
        .messages({
            'string.base': 'Image URL must be a valid string.',
            'string.uri': 'Image URL must be a valid URI.',
        }),
    tags: Joi.array()
        .items(Joi.string().custom(objectIdValidator).messages({
            'any.invalid': 'Each tag must be a valid ObjectId.',
            'string.base': 'Each tag must be a valid string.',
        }))
        .optional()
        .messages({
            'array.base': 'Tags must be an array of valid ObjectIds.',
        }),
    category: Joi.string()
        .custom(objectIdValidator)
        .required()
        .messages({
            'any.invalid': 'Category must be a valid ObjectId.',
            'string.base': 'Category must be a valid string.',
            'any.required': 'Category is required.',
        }),
    short_description: Joi.string()
        .max(1000)
        .allow('')
        .optional()
        .messages({
            'string.base': 'Short description must be a valid string.',
            'string.max': 'Short description should not exceed 1000 characters.',
        }),
    location: Joi.string()
        .max(100)
        .required()
        .messages({
            'string.base': 'Location must be a valid string.',
            'string.max': 'Location should not exceed 100 characters.',
            'any.required': 'Location is required.',
        }),
    long_description: Joi.string()
        .required()
        .max(4000)
        .messages({
            'string.base': 'Long description must be a valid string.',
            'string.max': 'Long description should not exceed 4000 characters.',
            'any.required': 'Long description is required.',
        }),
}).unknown(true); // Allow additional fields not explicitly defined

const validateNews = async (request, reply) => {
    return handleValidationError(request, reply, newsValidationSchema);
};

module.exports = {
    validateNews,
};