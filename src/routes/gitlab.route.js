const gitlabController = require('../controllers/gitlab.controller');
async function routes(fastify, options){
    fastify.post("/stats",  gitlabController.mergeRequestAnalyser);
}

module.exports = routes;