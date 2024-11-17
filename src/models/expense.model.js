const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name should be at least 3 characters long']
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        trim: true,
        match: [/^\d{10}$/, 'Mobile number must be a 10-digit number']  // Regex validation for mobile
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [1, 'Amount must be greater than 0'],
    },
    duration: {
        type: String,
        required: [true, 'Duration is required'],
        enum: ['1 Year', '6 Months', '3 Months'],  // Example of enum validation
    },
    start_date: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    end_date: {
        type: Date,
        required: [true, 'End date is required'],
        // validate: {
        //     validator: function(value) {
        //         return value > this.start_date;  // Ensure end_date is after start_date
        //     },
        //     message: 'End date must be after start date',
        // },
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description should not exceed 500 characters'],
    },
}, { timestamps: true })

const Expense = mongoose.model('expense', ExpenseSchema, 'expense');

module.exports = Expense;