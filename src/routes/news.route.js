const newsController = require('../controllers/news.controller');
const { validateNews } = require('../schema-validation/news.validation');
async function routes(fastify, options){
    fastify.get("/",  newsController.getAll);
    fastify.get("/:id", newsController.getSingle);
    fastify.post("/", {preHandler:[validateNews]}, newsController.create);
    fastify.put("/:id", {preHandler:[validateNews]}, newsController.update);
    fastify.delete("/:id", newsController.destroy);
}

module.exports = routes;