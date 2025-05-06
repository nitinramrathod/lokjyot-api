const loginController = require('../controllers/login.controller');
const { validateLogin } = require('../schema-validation/login.validation');
async function routes(fastify, options){
   
    fastify.post("/",loginController.login);
   
}

module.exports = routes;