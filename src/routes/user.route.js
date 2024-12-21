const userController = require('../controllers/user.controller');
const { validateUser } = require('../schema-validation/user.validation');
async function routes(fastify, options){
    fastify.get("/",  userController.getAll);
    fastify.get("/:id", userController.getSingle);
    fastify.post("/", {preHandler:[validateUser]}, userController.create);
    fastify.put("/:id", {preHandler:[validateUser]}, userController.update);
    fastify.delete("/:id", userController.destroy);
}

module.exports = routes;