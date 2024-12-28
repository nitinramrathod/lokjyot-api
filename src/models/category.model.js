const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        unique: true
    },  
   
 
}, { timestamps: true })


module.exports = mongoose.model("Category", CategorySchema);