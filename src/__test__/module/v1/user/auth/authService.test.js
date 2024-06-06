// import the dependency
import { StatusCodes } from "http-status-codes";
import { LocalStorage } from "node-localstorage";
import tableConstants from '~/constants/tableConstants';
import path from "path";

var localStorage = new LocalStorage(path.join(process.cwd(), 'src/__test__/localStorage')),
    requestHeader = JSON.parse(localStorage.getItem('apiHeader'));
const container = require('~/dependency'),
    authService = container.resolve("authService"),
    authModel = container.resolve("authModel"),
    logger = container.resolve("logger"),
    passwordHash = container.resolve("passwordHash"),
    DateTimeUtil = container.resolve("DateTimeUtil"),
    commonHelpers = container.resolve("commonHelpers");

jest.mock('../../../../../modules/v1/user/auth/models/AuthModel');
jest.mock('../../../../../utils/passwordHash');
jest.mock('../../../../../utils/DateTimeUtil');
jest.mock('../../../../../helpers/commonHelpers');
jest.mock('../../../../../utils/logger');


describe('unit testing for authService/loginService', () => {
    // prepare requestData
    const requestData = {
        'email': 'test.user@mailinator.com',
        'password': '$2a$10$Bg3yglry.lzjPdXUF4H2Ju1fk2iP3MFrnG7yWRdYs7psrRjYU0CyC3'
    }

    it('handle login success response', async () => {
        // Mock the behavior of authModel.fetchObjWithSingleRecord to return user data
        await authModel.fetchObjWithSingleRecord.mockResolvedValue({
            id: 1,
            email: 'test.user@mailinator.com',
            password: '$2a$10$Bg3yglry.lzjPdXUF4H2Ju1fk2iP3MFrnG7yWRdYs7psrRjYU0CyC'
        });

        // Mock the behavior of passwordHash.compareSync to indicate a password match
        passwordHash.compareSync.mockResolvedValue(true)


        // Mock the behavior of commonHelpers.getLoginResponse 
        await commonHelpers.getLoginResponse.mockResolvedValue({
            "code": StatusCodes.OK,
            "data": {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibGVqUmVqIiwiZGV2aWNlX2lkIjoiZGV2aWNlaWQiLCJpYXQiOjE3MDMyMjYzMzUsImV4cCI6MTcxMTAwMjMzNX0.wdNIc2oekJwFDsJObJQktwyQs9H3g5EdGGWqJZWnf24"
            }
        });

        const result = await authService.loginService(requestData, requestHeader);

        expect(result.status_code).toBe(200);
        expect(result.response.code).toBe(200);
        expect(result.response).toHaveProperty('data');
        expect(result.response.data).toHaveProperty('token');
    });

    it('handle invalid login credentials', async () => {
        // Mock the behavior of AuthModelObj to return user data
        await authModel.fetchObjWithSingleRecord.mockResolvedValue(undefined);

        const result = await authService.loginService(requestData, requestHeader);

        expect(result.status_code).toBe(400);
        expect(result).toHaveProperty('code');
    });

    it('handle error received in catch block', async () => {
        // Mock the behavior of AuthModelObj to return user data
        await authModel.fetchObjWithSingleRecord.mockRejectedValue(new Error('Internal Server Error'));

        const result = await authService.loginService(requestData, requestHeader);
        expect(logger.error).toHaveBeenCalled();
        expect(result).toBeInstanceOf(Error);
    });
});


