const News = require('../models/news.model');
const mongoose = require('mongoose');

const getAll = async (request, reply) => {
    try {
        // Fetch all expenses from the database
        const news = await News.find();

        // If no expenses found, return an empty array with a message
        if (news.length === 0) {
            return reply.status(404).send({
                message: 'No news found',
                data: []
            });
        }

        // If expenses are found, return them wrapped in a data field
        reply.status(200).send({
            message: 'News fetched successfully',
            data: news
        });

    } catch (error) {
        // Log the error for debugging
        console.error(error);

        // Send a standardized error response
        reply.status(500).send({
            message: 'An error occurred while fetching the news.',
            error: error.message
        });
    }
};
const getSingle = async (request, reply) => {
    try {
        // Validate if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
            return reply.status(400).send({
                message: 'Invalid News ID format'
            });
        }

        // Find the expense by ID
        const expense = await News.findById(request.params.id);

        // If no expense is found, return 404
        if (!expense) {
            return reply.status(404).send({
                message: 'News not found'
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

const create = async (req, res) => {
    try {

        // Create the expense in the database  
        console.log('req====>', req)      
        const {
            name,
            author_name,
            short_description,
            long_description,
            publish_date,
            image_url,
            category,
            tags,
        } = req.body;

        const news = await News.create({
            name,
            author_name,
            short_description,
            long_description,
            publish_date,
            image_url,
            category,
            tags,
        });

        // Send success response
        res.status(201).send({
            data: news,
            message: "News created successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Failed to create news.",
            error: error
        });
    }
};

const update = async (request, reply) => {
    try {
        const { id } = request.params;
        const updateData = request.body;

        // First, check if the expense with the given ID exists
        const expense = await News.findById(id);

        if (!expense) {
            return reply.status(404).send({
                message: 'News not found.'
            });
        }

        // Now perform the update with validation (runValidators ensures validation happens)
        const updatedExpense = await News.findByIdAndUpdate(id, updateData, {
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
const destroy = async (request, reply) => {
    try {
        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
            return reply.status(400).send({
                message: 'Invalid News ID format'
            });
        }

        // Attempt to find and delete the expense by ID
        const expense = await News.findByIdAndDelete(request.params.id);

        // If no expense was found to delete, return a 404 error
        if (!expense) {
            return reply.status(404).send({
                message: 'News not found'
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
    getAll,
    getSingle,
    create,
    update,
    destroy
}