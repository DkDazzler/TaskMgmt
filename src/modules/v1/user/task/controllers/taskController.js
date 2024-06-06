class taskController {

    constructor({ taskService, responseHandler }) {
        this.taskService = taskService;
        this.responseHandler = responseHandler
    }

    // Save task controller
    async saveTask(req, res, next) {
        req.body.userId = req.user.user_id;
        const returnData = await this.taskService.saveTask(req.body);
        await this.responseHandler.handleServiceResponse(req, res, returnData);
    }

    // Update task controller
    async updateTask(req, res, next) {
        req.body.userId = req.user.user_id;
        const returnData = await this.taskService.updateTask(req.body,req.params);
        await this.responseHandler.handleServiceResponse(req, res, returnData);
    }

    // Task list controller
    async getTaskList(req, res, next) {
        const returnData = await this.taskService.getTaskList(req.user.user_id,req.query);
        await this.responseHandler.handleServiceResponse(req, res, returnData);
    }

    // Get task controller
    async getTask(req, res, next) {
        const returnData = await this.taskService.getTask(req.user.user_id,req.params);
        await this.responseHandler.handleServiceResponse(req, res, returnData);
    }

    // Delete task controller
    async deleteTask(req, res, next) {
        const returnData = await this.taskService.deleteTask(req.user.user_id,req.params);
        await this.responseHandler.handleServiceResponse(req, res, returnData);
    }
}

module.exports = taskController;

