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

const userValidationSchema = Joi.object({
    name: createStringValidation().messages({
        'any.required': 'Name is required.',
    })

}).unknown(true);

const validateTag = async (request, reply) => {
    return await handleValidationError(request, reply, userValidationSchema);
};

module.exports = {
    validateTag,
};