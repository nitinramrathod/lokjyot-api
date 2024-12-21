const newsController = require('../controllers/news.controller');
const { validateNews } = require('../schema-validation/news.validation');
async function routes(fastify, options){
    fastify.get("/",  newsController.getAll);
    fastify.get("/:id", newsController.getSingle);
    fastify.post("/", {preHandler:[validateNews, fastify.authenticate]}, newsController.create);
    fastify.put("/:id", {preHandler:[validateNews, fastify.authenticate]}, newsController.update);
    fastify.delete("/:id", { preHandler: fastify.authenticate }, newsController.destroy);
}

module.exports = routes;