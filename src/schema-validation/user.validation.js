const Joi = require('joi');
const { handleValidationError } = require('../utils/helper/validationErrorMessage');

const stringValidationMessages = {
    'string.base': 'Should be a valid string.',
    'string.min': 'Should be at least 3 characters long.',
    'string.max': 'Should not exceed 200 characters.',
    'string.empty': 'Cannot be empty.',
    'any.required': 'Is required.',
};

// Reusable function for string validation
const createStringValidation = (customMessages = {}) => {
    return Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({ ...stringValidationMessages, ...customMessages });
};

// const userValidationSchema = // Reject unknown fields by default

const getUserValidationSchema = (isUpdate)=>{
return Joi.object({
    name: createStringValidation({ 'any.required': 'Name is required.' }),
    role: createStringValidation({ 'any.required': 'Role is required.' }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.base': 'Email should be a valid string.',
            'string.email': 'Email must be a valid email address.',
            'any.required': 'Email is required.',
        }),
    password: isUpdate ? Joi.string().min(8).max(100).optional(): createStringValidation({ 'any.required': 'Password is required.' }),
    confirm_password: isUpdate ? Joi.string().valid(Joi.ref('password')).optional(): Joi.string().required().valid(Joi.ref('password')) // Ensures passwords match
        .messages({
            'any.only': 'Passwords must match.',
            'any.required': 'Confirm password is required.',
        }),
}).unknown(true); 
}

const validateUser = async (payload, reply, isUpdate = false) => {
    const schema = getUserValidationSchema(isUpdate);
    return await handleValidationError(payload, reply, schema);
};

module.exports = {
    validateUser,
};