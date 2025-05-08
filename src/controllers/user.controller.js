const User = require('../models/user.model');
const mongoose = require('mongoose');
const { validateUser } = require('../schema-validation/user.validation');

const getAll = async (request, reply) => {
    try {
        // Fetch all expenses from the database
        const news = await User.find().sort({ createdAt: -1 });

        // If no expenses found, return an empty array with a message
        if (news.length === 0) {
            return reply.status(404).send({
                message: 'No news found',
                data: []
            });
        }

        // If expenses are found, return them wrapped in a data field
        reply.status(200).send({
            message: 'User fetched successfully',
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
        if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
            return reply.status(400).send({
                message: 'Invalid User ID format'
            });
        }

        const expense = await User.findById(request.params.id);

        if (!expense) {
            return reply.status(404).send({
                message: 'User not found'
            });
        }

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

        if (!request.isMultipart()) {
            return reply.status(422).send({ error: "Request must be multipart/form-data" });
        }

        let fields = await bodyParser(request);

        const validationResponse = await validateUser(fields, reply);
        if (validationResponse) return;


        const {
            name,
            email,
            password,
            role,
            image,
            mobile
        } = fields;

        const allowedRoles = ["admin", "publisher"];

        if (!allowedRoles.includes(role)) {
            return res.status(422).send({
                message: "Invalid role. Allowed roles are: " + allowedRoles.join(", "),
            });
        }

        const news = await User.create({
            name,
            email,
            password,
            role,
            image,
            mobile
        });

        // Send success response
        res.status(201).send({
            data: news,
            message: "User created successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Failed to create user.",
            error: error
        });
    }
};

const update = async (request, reply) => {
    try {

        
        if (!request.isMultipart()) {
            return reply.status(422).send({ error: "Request must be multipart/form-data" });
        }

        let fields = await bodyParser(request);

        const validationResponse = await validateUser(fields, reply);
        if (validationResponse) return;

        const { id } = request.params;
        const updateData = fields;

        const user = await User.findById(id);

        if (!user) {
            return reply.status(404).send({
                message: 'User not found.'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
            new: true,           // Returns the updated document
            runValidators: true, // Ensures validation is run on update
        });

        if (!updatedUser) {
            return reply.status(400).send({
                message: 'Failed to update expense.',
            });
        }

        // Return the updated data
        reply.status(200).send({
            data: updatedUser,  // Send back the updated document
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
        const { id } = request.params;

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.status(400).send({
                message: 'Invalid User ID format'
            });
        }

        // Attempt to find and delete the expense by ID
        const expense = await User.findByIdAndDelete(id);

        // If no expense was found to delete, return a 404 error
        if (!expense) {
            return reply.status(404).send({
                message: 'User not found'
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