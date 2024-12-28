const newsController = require('../controllers/news.controller');
const { validateNews } = require('../schema-validation/news.validation');
async function routes(fastify, options){
    fastify.get("/",  newsController.getAll);
    fastify.get("/:id", newsController.getSingle);
    // Add the changeStatus API route
    fastify.patch("/:id/status", { preHandler: fastify.authenticate }, newsController.changeStatus);

}

module.exports = routes;