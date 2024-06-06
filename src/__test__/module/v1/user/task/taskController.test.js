// import the dependency
import { StatusCodes } from "http-status-codes";
const container = require('~/dependency'),
    taskController = container.resolve("taskController"),
    taskService = container.resolve("taskService"),
    responseHandler = container.resolve("responseHandler");

// Import and mock dependencies
jest.mock('../../../../../modules/v1/user/task/services/taskService');
jest.mock('../../../../../middlewares/responseHandler');

// Common test data
const req = { body: {}, headers: {},  user:{} };
const res = {};

// Common success response
const successResponse = {
    status_code: StatusCodes.OK,
    code: StatusCodes.OK,
    response: {}
}

// Common bad request response
const badRequestResponse = {
    status_code: StatusCodes.BAD_REQUEST,
    code: StatusCodes.BAD_REQUEST,
    response: {}
}

// Common internal server error response
const internalServerError = {
    status_code: StatusCodes.INTERNAL_SERVER_ERROR,
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    response: {}
}


describe('unit testing for taskController/saveTask', () => {

    it('handle a successful saveTask response', async () => {
        // Mock the taskService's saveTask
        await taskService.saveTask.mockResolvedValue(successResponse);
        await taskController.saveTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, successResponse);
    });

    it('handle bad request response', async () => {
        // Mock the taskService's saveTask
        await taskService.saveTask.mockResolvedValue(badRequestResponse);
        await taskController.saveTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, badRequestResponse);
    });

    it('should handle internal server error', async () => {
        // Mock the taskService's saveTask
        await taskService.saveTask.mockResolvedValue(internalServerError);
        await taskController.saveTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, internalServerError);
    });
});

describe('unit testing for taskController/updateTask', () => {

    it('handle a successful updateTask response', async () => {
        // Mock the taskService's updateTask
        await taskService.updateTask.mockResolvedValue(successResponse);
        await taskController.updateTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, successResponse);
    });

    it('handle bad request response', async () => {
        // Mock the taskService's updateTask
        await taskService.updateTask.mockResolvedValue(badRequestResponse);
        await taskController.updateTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, badRequestResponse);
    });

    it('should handle internal server error', async () => {
        // Mock the taskService's updateTask
        await taskService.updateTask.mockResolvedValue(internalServerError);
        await taskController.updateTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, internalServerError);
    });
});

describe('unit testing for taskController/getTaskList', () => {

    it('handle a successful getTaskList response', async () => {
        // Mock the taskService's getTaskList
        await taskService.getTaskList.mockResolvedValue(successResponse);
        await taskController.getTaskList(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, successResponse);
    });

    it('handle bad request response', async () => {
        // Mock the taskService's getTaskList
        await taskService.getTaskList.mockResolvedValue(badRequestResponse);
        await taskController.getTaskList(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, badRequestResponse);
    });

    it('should handle internal server error', async () => {
        // Mock the taskService's getTaskList
        await taskService.getTaskList.mockResolvedValue(internalServerError);
        await taskController.getTaskList(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, internalServerError);
    });
});

describe('unit testing for taskController/getTask', () => {

    it('handle a successful getTask response', async () => {
        // Mock the taskService's getTask
        await taskService.getTask.mockResolvedValue(successResponse);
        await taskController.getTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, successResponse);
    });

    it('handle bad request response', async () => {
        // Mock the taskService's getTask
        await taskService.getTask.mockResolvedValue(badRequestResponse);
        await taskController.getTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, badRequestResponse);
    });

    it('should handle internal server error', async () => {
        // Mock the taskService's getTask
        await taskService.getTask.mockResolvedValue(internalServerError);
        await taskController.getTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, internalServerError);
    });
});

describe('unit testing for taskController/deleteTask', () => {

    it('handle a successful deleteTask response', async () => {
        // Mock the taskService's deleteTask
        await taskService.deleteTask.mockResolvedValue(successResponse);
        await taskController.deleteTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, successResponse);
    });

    it('handle bad request response', async () => {
        // Mock the taskService's deleteTask
        await taskService.deleteTask.mockResolvedValue(badRequestResponse);
        await taskController.deleteTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, badRequestResponse);
    });

    it('should handle internal server error', async () => {
        // Mock the taskService's deleteTask
        await taskService.deleteTask.mockResolvedValue(internalServerError);
        await taskController.deleteTask(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, internalServerError);
    });
});