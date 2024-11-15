const Fastify = require('fastify');
const expenseRoute = require('./routes/expense.route')
const fastify = Fastify({ logger: true });
const cors = require('@fastify/cors')

// Register CORS plugin
fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],  // Add the HTTP methods you need
});

require('dotenv').config();

require('./dbConnection');

const port = process.env.PORT || 3000;

// Declare Routes 
fastify.register(expenseRoute, {prefix: "api/v1/expenses"})

// Run Server 
const start = async () => {
    try {
        await fastify.listen({ port: port })
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}

start();