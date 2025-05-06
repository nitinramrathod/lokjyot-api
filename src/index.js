const Fastify = require('fastify');
const fastify = Fastify({ logger: true });
const cors = require('@fastify/cors')
const jwt = require('@fastify/jwt');
// Register CORS plugin
fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],  // Add the HTTP methods you need
});

require('dotenv').config();

require('./utils/dbConnection');

const port = process.env.PORT || 3000;

const newsRoute = require('./routes/news.route');
const adminNewsRoute = require('./routes/dashboard/news.route');
const userRoute = require('./routes/user.route');
const tagRoute = require('./routes/tag.route');
const categoryRoute = require('./routes/category.route');
const loginRoute = require('./routes/login.route');
const fastifyStatic =require('@fastify/static');
const fastifyMultipart = require("@fastify/multipart");
const path =require('path');

fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/', // Access via /public/images/...
});

fastify.register(fastifyMultipart, {
    limits: {
      // fieldNameSize: 100,
      // fieldSize: 100,
      // fields: 30,
      fileSize: 1000000,
      files: 1,
      headerPairs: 2000,
      parts: 1000,
    },
  });

fastify.register(jwt, {
    secret: process.env.JWT_SECRET_KEY || 'hello', 
})
fastify.decorate('authenticate', async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.status(401).send({ message: 'Unauthorized access', error: err.message });
    }
});

fastify.get('/', (req, reply)=>{
    return reply.status(200).send({
        message: 'Welcome to home',
    });
})

// Declare Routes 
fastify.register(newsRoute, {prefix: "api/v1/news"})

// Admin Routes 
fastify.register(userRoute, {prefix: "api/v1/user"})
fastify.register(tagRoute, {prefix: "api/v1/tag"})
fastify.register(categoryRoute, {prefix: "api/v1/category"})
fastify.register(adminNewsRoute, {prefix: "api/v1/admin/news"})

// Auth Routes 
fastify.register(loginRoute, {prefix: "api/v1/login"})


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