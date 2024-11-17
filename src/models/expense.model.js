const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    endDate: { type: String, trim: true },
    description: { type: String, trim: true },
})

const Expense = mongoose.model('expense', ExpenseSchema, 'expense');

module.exports = Expense;