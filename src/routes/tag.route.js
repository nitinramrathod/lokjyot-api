const tagController = require('../controllers/tag.controller');
const { validateTag } = require('../schema-validation/tag.validation');
async function routes(fastify, options){
    fastify.get("/",  tagController.getAll);
    fastify.get("/:id", tagController.getSingle);
    fastify.post("/", tagController.create);
    fastify.put("/:id", tagController.update);
    fastify.delete("/:id", tagController.destroy);
}

module.exports = routes;