const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    mobile: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    description: { type: String, trim: true },
})

const Expense = mongoose.model('expense', ExpenseSchema, 'expense');

module.exports = Expense;