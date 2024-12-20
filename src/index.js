const Fastify = require('fastify');
const newsRoute = require('./routes/news.route')
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

fastify.get('/', (req, reply)=>{
    return reply.status(200).send({
        message: 'Welcome to home',
    });
})

// Declare Routes 
fastify.register(newsRoute, {prefix: "api/v1/news"})

// Run Server 
const start = async () => {
    try {
        await fastify.listen({ port: port, host: '0.0.0.0'  })
        fastify.log.info(
            `Server started on port ${fastify.server.address().port}`
        );
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}

start();