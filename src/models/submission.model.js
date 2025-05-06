const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },  
    email: {
        type: String,
        trim: true
    },  
    mobile: {
        type: String,
        required: [true, 'Mobile is required'],
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    }
}, { timestamps: true })


module.exports = mongoose.model("Submission", SubmissionSchema);