const Joi = require('joi');
const { handleValidationError } = require('../utils/helper/validationErrorMessage');

const submissionValidationSchema = Joi.object({
    name: Joi.string()
        .max(100)
        .required()
        .messages({
            'string.base': 'Name must be a valid string.',
            'string.max': 'Name should not exceed 100 characters.',
            'any.required': 'Name is required.'
        }),
    mobile: Joi.string()
        .max(20)
        .required()
        .messages({
            'string.base': 'Mobile must be a valid string.',
            'string.max': 'Mobile should not exceed 20 characters.',
            'any.required': 'Mobile is required.'
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .messages({
            'string.base': 'Email should be a valid string.',
            'string.email': 'Email must be a valid email address.'
        }),
    title: Joi.string()
        .required()
        .max(250)
        .messages({
            'string.base': 'Title must be a valid string.',
            'string.max': 'Title should not exceed 250 characters.',
            'any.required': 'Title is required.'
        }),
    message: Joi.string()
        .required()
        .max(3000)
        .messages({
            'string.base': 'Message must be a valid string.',
            'string.max': 'Message should not exceed 3000 characters.',
            'any.required': 'Message is required.'
        }),

}).unknown(false); // Reject unknown fields by default

const validateSubmission = async (payload, reply) => {
    return await handleValidationError(payload, reply, submissionValidationSchema);
};

module.exports = {
    validateSubmission,
};