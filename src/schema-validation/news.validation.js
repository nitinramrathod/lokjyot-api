const Joi = require('joi');
const { handleValidationError } = require('../helper/validationErrorMessage');

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

    // tags: Joi.array()
    //     .items(Joi.string().trim())
    //     .optional()
    //     .messages({
    //         'array.base': 'Tags must be an array of strings.',
    //         'string.base': 'Each tag must be a string.',
    //     }),

    // category: Joi.string()
    //     .optional()
    //     .messages({
    //         'string.base': 'Category must be a valid string.',
    //     }),

    short_description: Joi.string()
        .max(1000)
        .allow('')
        .optional()
        .messages({
            'string.base': 'Short description must be a valid string.',
            'string.max': 'Short description should not exceed 1000 characters.',
        }),

    long_description: Joi.string()
        .max(1000)
        .allow('')
        .optional()
        .messages({
            'string.base': 'Long description must be a valid string.',
            'string.max': 'Long description should not exceed 1000 characters.',
        }),
}).unknown(true);

const validateNews = async (request, reply) => {
    return handleValidationError(request, reply, newsValidationSchema);
};

module.exports = {
    validateNews,
};