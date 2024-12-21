const loginController = require('../controllers/login.controller');
const { validateLogin } = require('../schema-validation/login.validation');
async function routes(fastify, options){
   
    fastify.post("/", {preHandler: [validateLogin]},loginController.login);
   
}

module.exports = routes;