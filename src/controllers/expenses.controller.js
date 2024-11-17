const Expense = require('../models/expense.model');
const mongoose = require('mongoose');

const getAllExpenses = async (request, reply) => {
    try {
        // Fetch all expenses from the database
        const expenses = await Expense.find();

        // If no expenses found, return an empty array with a message
        if (expenses.length === 0) {
            return reply.status(200).send({
                message: 'No expenses found',
                data: []
            });
        }

        // If expenses are found, return them wrapped in a data field
        reply.status(200).send({
            message: 'Expenses fetched successfully',
            data: expenses
        });

    } catch (error) {
        // Log the error for debugging
        console.error(error);

        // Send a standardized error response
        reply.status(500).send({
            message: 'An error occurred while fetching the expenses.',
            error: error.message
        });
    }
};
const getExpenseById = async (request, reply) => {
    try {
        // Validate if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
            return reply.status(400).send({
                message: 'Invalid Expense ID format'
            });
        }

        // Find the expense by ID
        const expense = await Expense.findById(request.params.id);

        // If no expense is found, return 404
        if (!expense) {
            return reply.status(404).send({
                message: 'Expense not found'
            });
        }

        // If found, return the expense data
        reply.status(200).send({
            data: expense
        });

    } catch (error) {
        // General error handling
        console.error(error);
        reply.status(500).send({
            message: 'An error occurred while fetching the expense.',
            error: error.message
        });
    }
};
const createExpense = async (request, reply) => {
    try {

        const data = await Expense.create(request.body); 

        reply.status(201).send({
            data: data.toObject(),
            message: "Data created successfully."
        });
    } catch (error) {
         // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            // Initialize an empty object to store field-specific error messages
            const validationErrors = {};

            // Loop through each error in the `error.errors` object
            Object.values(error.errors).forEach(err => {
                const field = err.path;  // The field name (e.g., 'name', 'mobile')
                const message = err.message;  // The validation error message

                // If this field already has an error array, push the message, else create a new array
                if (!validationErrors[field]) {
                    validationErrors[field] = [];
                }
                validationErrors[field].push(message);
            });

            // Return the formatted validation error response
            return reply.status(400).send({
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Handle other types of errors
        console.error(error);
        return reply.status(500).send({
            message: "Failed to create expense.",
            error: error.message
        });
    
    }
}
const updateExpense = async (request, reply) => {
    try {
        const { id } = request.params;
        const updateData = request.body;

        // First, check if the expense with the given ID exists
        const expense = await Expense.findById(id);

        if (!expense) {
            return reply.status(404).send({
                message: 'Expense not found.'
            });
        }

        // Now perform the update with validation (runValidators ensures validation happens)
        const updatedExpense = await Expense.findByIdAndUpdate(id, updateData, {
            new: true,           // Returns the updated document
            runValidators: true, // Ensures validation is run on update
        });

        // If validation fails, Mongoose will throw an error, so catch that
        if (!updatedExpense) {
            return reply.status(400).send({
                message: 'Failed to update expense.',
            });
        }

        // Return the updated data
        reply.status(200).send({
            data: updatedExpense,  // Send back the updated document
            message: 'Data updated successfully.'
        });

    } catch (error) {
        // Handle validation error and send a formatted response
        if (error.name === 'ValidationError') {
            // Collect validation errors in an object where the field name is the key
            const validationErrors = {};

            // Loop through all the validation errors and format them
            Object.values(error.errors).forEach(err => {
                const field = err.path;  // The field name
                const message = err.message;  // The error message

                // If this field already has an error array, push the message, else create a new array
                if (!validationErrors[field]) {
                    validationErrors[field] = [];
                }
                validationErrors[field].push(message);
            });

            return reply.status(400).send({
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Handle other types of errors (non-validation errors)
        console.error(error);
        return reply.status(500).send({
            message: 'An error occurred while updating the expense.',
            error: error.message
        });
    }
};
const deleteExpense = async (request, reply) => {
    try {
        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
            return reply.status(400).send({
                message: 'Invalid Expense ID format'
            });
        }

        // Attempt to find and delete the expense by ID
        const expense = await Expense.findByIdAndDelete(request.params.id);

        // If no expense was found to delete, return a 404 error
        if (!expense) {
            return reply.status(404).send({
                message: 'Expense not found'
            });
        }

        // Successfully deleted, return a success message
        reply.status(200).send({
            message: 'Record deleted successfully.'
        });

    } catch (error) {
        // Log the error for debugging purposes
        console.error(error);

        // Return a standardized error response
        reply.status(500).send({
            message: 'An error occurred while deleting the expense.',
            error: error.message
        });
    }
};

module.exports = {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
}