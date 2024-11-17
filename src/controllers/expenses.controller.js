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
        reply.status(500).send(error)
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