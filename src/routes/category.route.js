const categoryController = require('../controllers/category.controller');
const { validateTag } = require('../schema-validation/tag.validation');
async function routes(fastify, options){
    fastify.get("/",  categoryController.getAll);
    fastify.get("/:id", categoryController.getSingle);
    fastify.post("/", categoryController.create);
    fastify.put("/:id", categoryController.update);
    fastify.delete("/:id", categoryController.destroy);
}

module.exports = routes;