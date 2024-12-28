const categoryController = require('../controllers/category.controller');
const { validateTag } = require('../schema-validation/tag.validation');
async function routes(fastify, options){
    fastify.get("/",  categoryController.getAll);
    fastify.get("/:id", categoryController.getSingle);
    fastify.post("/", {preHandler:[validateTag]}, categoryController.create);
    fastify.put("/:id", {preHandler:[validateTag]}, categoryController.update);
    fastify.delete("/:id", categoryController.destroy);
}

module.exports = routes;