// import the dependency
import { StatusCodes } from "http-status-codes";
const container = require('~/dependency'),
    authController = container.resolve("authController"),
    authService = container.resolve("authService"),
    responseHandler = container.resolve("responseHandler");

// Import and mock dependencies
jest.mock('../../../../../modules/v1/user/auth/services/authService');
jest.mock('../../../../../middlewares/responseHandler');

// Common test data
const req = { body: {}, headers: {} };
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


describe('unit testing for authController/login', () => {

    it('handle a successful login response', async () => {
        // Mock the authService's loginService
        await authService.loginService.mockResolvedValue(successResponse);
        await authController.login(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, successResponse);
    });

    it('handle bad request response', async () => {
        // Mock the authService's loginService
        await authService.loginService.mockResolvedValue(badRequestResponse);
        await authController.login(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, badRequestResponse);
    });

    it('should handle internal server error', async () => {
        await authService.loginService.mockResolvedValue(internalServerError);
        await authController.login(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, internalServerError);
    });
});

describe('unit testing for authController/signup', () => {

    it('handle a successful signup response', async () => {
        // Mock the authService.signupService
        await authService.signupService.mockResolvedValue(successResponse);
        await authController.signup(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, successResponse);
    });

    it('handle bad request response', async () => {
        // Mock the authService.signupService
        await authService.signupService.mockResolvedValue(badRequestResponse);
        await authController.signup(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, badRequestResponse);
    });

    it('should handle internal server error', async () => {
        await authService.signupService.mockResolvedValue(internalServerError);
        await authController.signup(req, res);
        expect(responseHandler.handleServiceResponse).toHaveBeenCalledWith(req, res, internalServerError);
    });
});


