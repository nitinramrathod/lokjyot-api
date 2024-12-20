const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    author_name: {
        type: String,
        required: [true, 'author is required'],
        trim: true,
    },
    short_description: {
        type: String,
        trim: true,
    },
    long_description: {
        type: String,
        required: [true, 'Long description is required'],
        trim: true,
    },
    publish_date: {
        type: String,
        trim: true,
    },
    image_url: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
    },
    tags: {
        type: String,
        trim: true,
    },
 
}, { timestamps: true })

const News = mongoose.model('news', NewsSchema);

module.exports = News;