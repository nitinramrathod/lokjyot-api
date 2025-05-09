const dashboardController = require('../controllers/dashboard.controller');
async function routes(fastify, options){
    fastify.get("/stats",  dashboardController.getStats);
}

module.exports = routes;