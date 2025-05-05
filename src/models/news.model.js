const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    short_description: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    status:{
        type: String,
        required: [true, 'Status is required'],
        trim: true,
        default: "pending",
        enum: ["active", "inactive", "pending", "rejected"]
    },
    type:{
        type: String,
        required: [true, 'Type is required'],
        trim: true,
        default: "news",
        enum: ["news", "article"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag', 
    }],
    long_description: {
        type: String,
        required: [true, 'Long description is required'],
        trim: true,
    },
    publish_date: {
        type: Date,
        trim: true,
    },
    author_name: {
        type: String,
        required: [true, 'Author is required'],
        trim: true,
    },
}, { timestamps: true });

const News = mongoose.model('News', NewsSchema);

module.exports = News;