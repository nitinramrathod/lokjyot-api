const tagController = require('../controllers/tag.controller');
const { validateTag } = require('../schema-validation/tag.validation');
async function routes(fastify, options){
    fastify.get("/",  tagController.getAll);
    fastify.get("/:id", tagController.getSingle);
    fastify.post("/", {preHandler:[validateTag]}, tagController.create);
    fastify.put("/:id", {preHandler:[validateTag]}, tagController.update);
    fastify.delete("/:id", tagController.destroy);
}

module.exports = routes;