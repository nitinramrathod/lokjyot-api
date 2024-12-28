const Joi = require('joi');
const { handleValidationError } = require('../utils/helper/validationErrorMessage');


const stringValidationMessages = {
    'string.base': 'Should be a valid string.',
    'string.min': 'Should be at least 3 characters long.',
    'string.max': 'Should not exceed 200 characters.',
    'string.empty': 'Cannot be empty.',
    'any.required': 'Is required.',
};

// Reusable function to create string validation schema with custom messages
const createStringValidation = () => {
    return Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages(stringValidationMessages);
};

const loginValidationSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.base': 'Email should be a valid string.',
            'string.email': 'Email must be a valid email address.',
            'any.required': 'Email is required.',
        }),
    password: createStringValidation().messages({
        'any.required': 'Password is required.',
    }),

}).unknown(true);

const validateLogin = async (request, reply) => {
    return handleValidationError(request, reply, loginValidationSchema);
};

module.exports = {
    validateLogin,
};