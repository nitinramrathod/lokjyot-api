const submissionController = require('../controllers/submission.controller');

async function routes(fastify, options){
    fastify.get("/", {preHandler:fastify.authenticate},  submissionController.getAll);
    fastify.get("/:id", {preHandler:fastify.authenticate}, submissionController.getSingle);
    fastify.post("/", submissionController.create);
    fastify.put("/:id", {preHandler:fastify.authenticate}, submissionController.update);
    fastify.delete("/:id", { preHandler: fastify.authenticate }, submissionController.destroy);
}

module.exports = routes;