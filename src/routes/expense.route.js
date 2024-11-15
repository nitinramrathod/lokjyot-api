const expenseController = require('../controllers/expenses.controller')
async function routes(fastify, options){
    fastify.get("/", expenseController.getAllExpenses);
    fastify.get("/:id", expenseController.getExpenseById);
    fastify.post("/", expenseController.createExpense);
    fastify.put("/:id", expenseController.updateExpense);
    fastify.delete("/:id", expenseController.deleteExpense);
}

module.exports = routes;