const gitlabController = require('../controllers/gitlab.controller');
async function routes(fastify, options){
    fastify.post("/",  gitlabController.mergeRequestAnalyser);
}

module.exports = routes;