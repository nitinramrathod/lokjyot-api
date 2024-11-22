const Joi = require('joi');

// Joi schema for validating Expense data
const expenseSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .empty('')  
        .required()
        .messages({
            'string.base': 'Name should be a string',
            'string.min': 'Name should be at least 3 characters long',
            'string.max': 'Name should be less than or equal to 100 characters long',
            'string.required': 'Name is required and must 173',
        }),

    mobile: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            'string.base': 'Mobile number must be a string',
            'string.pattern.base': 'Mobile number must be a 10-digit number',
            'string.required': 'Mobile number is required',
        }),

    amount: Joi.number()
        .min(1)
        .required()
        .messages({
            'number.base': 'Amount should be a number',
            'number.min': 'Amount must be greater than 0',
            'number.required': 'Amount is required',
        }),

    duration: Joi.string()
        .valid('short-term', 'long-term')  // Example of enum validation, replace with your actual valid values
        .required()
        .messages({
            'string.base': 'Duration should be a string',
            'string.required': 'Duration is required',
            'any.only': 'Duration must be one of the allowed values: short-term, long-term',
        }),

    start_date: Joi.date()
        .required()
        .messages({
            'date.base': 'Start date must be a valid date',
            'date.required': 'Start date is required',
        }),

    end_date: Joi.date()
        .greater(Joi.ref('start_date'))
        .required()
        .messages({
            'date.base': 'End date must be a valid date',
            'date.required': 'End date is required',
            'date.greater': 'End date must be after the start date',
        }),

    description: Joi.string()
        .max(500)
        .optional()  // Description is optional but has a max length
        .messages({
            'string.base': 'Description should be a string',
            'string.max': 'Description should not exceed 500 characters',
        }),
});


const validateExpense = async (req, res, next) => {
    try {
        // Validate the request body using Joi
        await expenseSchema.validateAsync(req.body,  { abortEarly: false });

        // If validation passes, proceed to the next middleware
        next();
    } catch (error) {
        const validationErrors = {};

        // Loop through the error details
        error.details.forEach(err => {
            const field = err.path[0];  // Get the field name (e.g., 'name', 'mobile')
            let message = err.message; // Get the error message

            message = message.replace(/\\/g, '').replace(/\"/g, '');

            // Assign the message to the corresponding field in validationErrors
            validationErrors[field] = message;
        });

        // Send the formatted error response
        return res.status(400).send({
            message: 'Validation failed',
            errors: validationErrors
        });
    }
};


module.exports = {
    validateExpense,
    expenseSchema
};
