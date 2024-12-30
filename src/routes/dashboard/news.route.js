const newsController = require('../../controllers/news.controller');
const { validateNews } = require('../../schema-validation/news.validation');
async function routes(fastify, options){
    fastify.get("/", {preHandler:[fastify.authenticate]},  newsController.adminGetAll);
    fastify.get("/:id", newsController.getSingle);
    fastify.post("/", {preHandler:[fastify.authenticate, validateNews]}, newsController.create);
    fastify.put("/:id", {preHandler:[fastify.authenticate, validateNews]}, newsController.update);
    fastify.delete("/:id", { preHandler: fastify.authenticate }, newsController.destroy);

    // Add the changeStatus API route
    fastify.post("/change-status/:id", { preHandler: fastify.authenticate }, newsController.changeStatus);

}

module.exports = routes;