const Expense = require('../models/expense.model');

const getAllExpenses = async (request, reply) => {
    try {
        const expense = await Expense.find();
        reply.status(200).send(expense);

    } catch (error) {
        reply.status(500).send(error)
    }
}
const getExpenseById = async (request, reply) => {
    try {
        const expense = await Expense.findById(request.params.id);
        reply.status(200).send(expense);

    } catch (error) {
        reply.status(500).send(error)
    }
}
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
         await Expense.findByIdAndUpdate(request.params.id, request.body);
        reply.status(200).send({
            data: request.body,
            message: "Data updated successfully."
        });

    } catch (error) {
        reply.status(500).send(error)
    }
}
const deleteExpense = async (request, reply) => {
    try {
        await Expense.findByIdAndDelete(request.params.id)
        reply.status(200).send({ message: "Record deleted successfully." });

    } catch (error) {
        reply.status(500).send(error)
    }
}

module.exports = {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
}