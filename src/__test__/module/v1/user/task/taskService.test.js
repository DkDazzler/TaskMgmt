// import the dependency
import { StatusCodes } from "http-status-codes";
import tableConstants from '~/constants/tableConstants';

const container = require('~/dependency'),
    taskService = container.resolve("taskService"),
    taskModel = container.resolve("taskModel"),
    logger = container.resolve("logger"),
    commonHelpers = container.resolve("commonHelpers"),
    DateTimeUtil = container.resolve("DateTimeUtil");

jest.mock('../../../../../modules/v1/user/task/models/TaskModel');
jest.mock('../../../../../utils/DateTimeUtil');
jest.mock('../../../../../helpers/commonHelpers');
jest.mock('../../../../../utils/logger');


describe("unit testing for taskService/saveTask", () => {
  test("should save task successfully", async () => {
    const requestData = {
      title: "Test Task",
      description: "Test Description",
      status: "Pending",
      userId: 1,
    };

    const mockCurrentTime = new Date();
    const mockResponse = { status: StatusCodes.OK, message: "SUCCESS" };

    // Mock the responses of the dependencies
    DateTimeUtil.getCurrentTimeObjForDB.mockReturnValue(mockCurrentTime);
    commonHelpers.prepareResponse.mockResolvedValue(mockResponse);

    const result = await taskService.saveTask(requestData);

    // Assert that the taskModel.createObj method was called correctly
    expect(taskModel.createObj).toHaveBeenCalledWith(
      {
        title: "Test Task",
        description: "Test Description",
        status: "Pending",
        userId: 1,
        createdAt: mockCurrentTime,
      },
      tableConstants.TASKS
    );

    // Assert that the commonHelpers.prepareResponse method was called correctly
    expect(commonHelpers.prepareResponse).toHaveBeenCalledWith(
      StatusCodes.OK,
      "SUCCESS"
    );

    // Assert that the result is the expected response
    expect(result).toBe(mockResponse);
  });

  test("should handle error when saving task fails", async () => {
    const requestData = {
      title: "Test Task",
      description: "Test Description",
      status: "Pending",
      userId: 1,
    };

    const mockError = new Error("Failed to create task");

    // Mock the response of the DateTimeUtil and taskModel.createObj
    DateTimeUtil.getCurrentTimeObjForDB.mockReturnValue(new Date());
    taskModel.createObj.mockRejectedValue(mockError);

    const result = await taskService.saveTask(requestData);

    // Assert that the taskModel.createObj method was called
    expect(taskModel.createObj).toHaveBeenCalled();

    // Assert that the error was logged
    expect(logger.error).toHaveBeenCalledWith(mockError);

    // Assert that the result is the error
    expect(result).toBe(mockError);
  });
});

describe("unit testing for taskService/updateTask", () => {
  test("should update task successfully", async () => {
    const requestData = {
      title: "Updated Task",
      description: "Updated Description",
      status: "Completed",
      userId: 1,
    };
    const reqParams = {
      id: "encryptedId",
    };

    const decodedTaskId = 123;
    const mockCurrentTime = new Date();
    const mockResponse = { status: StatusCodes.OK, message: "SUCCESS" };

    // Mock the responses of the dependencies
    commonHelpers.decrypt.mockReturnValue(decodedTaskId);
    taskModel.fetchObjWithSingleRecord.mockResolvedValue(true);
    DateTimeUtil.getCurrentTimeObjForDB.mockReturnValue(mockCurrentTime);
    commonHelpers.prepareResponse.mockResolvedValue(mockResponse);

    const result = await taskService.updateTask(requestData, reqParams);

    // Assert that the taskModel.fetchObjWithSingleRecord method was called correctly
    expect(taskModel.fetchObjWithSingleRecord).toHaveBeenCalledWith(
      { id: decodedTaskId, userId: requestData.userId },
      "id",
      tableConstants.TASKS
    );

    // Assert that the taskModel.updateObj method was called correctly
    expect(taskModel.updateObj).toHaveBeenCalledWith(
      {
        title: "Updated Task",
        description: "Updated Description",
        status: "Completed",
        updatedAt: mockCurrentTime,
      },
      { id: decodedTaskId },
      tableConstants.TASKS
    );

    // Assert that the commonHelpers.prepareResponse method was called correctly
    expect(commonHelpers.prepareResponse).toHaveBeenCalledWith(
      StatusCodes.OK,
      "SUCCESS"
    );

    // Assert that the result is the expected response
    expect(result).toBe(mockResponse);
  });

  test("should handle invalid task ID", async () => {
    const requestData = {
      title: "Updated Task",
      description: "Updated Description",
      status: "Completed",
      userId: 1,
    };
    const reqParams = {
      id: "encryptedId",
    };

    const decodedTaskId = 123;
    const mockResponse = {
      status: StatusCodes.BAD_REQUEST,
      message: "INVALID_TASK_ID",
    };

    // Mock the responses of the dependencies
    commonHelpers.decrypt.mockReturnValue(decodedTaskId);
    taskModel.fetchObjWithSingleRecord.mockResolvedValue(false);
    commonHelpers.prepareResponse.mockResolvedValue(mockResponse);

    const result = await taskService.updateTask(requestData, reqParams);

    // Assert that the taskModel.fetchObjWithSingleRecord method was called correctly
    expect(taskModel.fetchObjWithSingleRecord).toHaveBeenCalledWith(
      { id: decodedTaskId, userId: requestData.userId },
      "id",
      tableConstants.TASKS
    );

    // Assert that the commonHelpers.prepareResponse method was called correctly
    expect(commonHelpers.prepareResponse).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      "INVALID_TASK_ID"
    );

    // Assert that the result is the expected response
    expect(result).toBe(mockResponse);
  });

  test("should handle error when updating task fails", async () => {
    const requestData = {
      title: "Updated Task",
      description: "Updated Description",
      status: "Completed",
      userId: 1,
    };
    const reqParams = {
      id: "encryptedId",
    };

    const decodedTaskId = 123;
    const mockError = new Error("Failed to update task");

    // Mock the responses of the dependencies
    commonHelpers.decrypt.mockReturnValue(decodedTaskId);
    taskModel.fetchObjWithSingleRecord.mockResolvedValue(true);
    DateTimeUtil.getCurrentTimeObjForDB.mockReturnValue(new Date());
    taskModel.updateObj.mockRejectedValue(mockError);

    const result = await taskService.updateTask(requestData, reqParams);

    // Assert that the taskModel.updateObj method was called
    expect(taskModel.updateObj).toHaveBeenCalled();

    // Assert that the error was logged
    expect(logger.error).toHaveBeenCalledWith(mockError);

    // Assert that the result is the error
    expect(result).toBe(mockError);
  });
});

describe("unit testing for taskService/getTaskList", () => {
  test("should get task list successfully", async () => {
    const userId = 1;
    const reqQuery = { pageNo: 1, search: "Test" };

    const mockTasks = [{ id: 1, title: "Test Task" }];
    const mockCount = 1;
    const mockResponse = {
      status: StatusCodes.OK,
      message: "SUCCESS",
      data: { taskList: mockTasks, loadMore: false, count: mockCount },
    };

    taskModel.fetchTasks
      .mockResolvedValueOnce(mockTasks)
      .mockResolvedValueOnce(mockCount);
    commonHelpers.encrypt.mockReturnValue("encryptedId");
    commonHelpers.prepareResponse.mockResolvedValue(mockResponse);

    const result = await taskService.getTaskList(userId, reqQuery);

    expect(taskModel.fetchTasks).toHaveBeenCalledTimes(2);
    expect(taskModel.fetchTasks).toHaveBeenCalledWith(
      { userId: userId },
      0,
      false,
      "(title LIKE '%Test%' OR description LIKE '%Test%' OR status LIKE '%Test%')"
    );
    expect(taskModel.fetchTasks).toHaveBeenCalledWith(
      { userId: userId },
      0,
      true,
      "(title LIKE '%Test%' OR description LIKE '%Test%' OR status LIKE '%Test%')"
    );
    expect(commonHelpers.encrypt).toHaveBeenCalledWith(1);
    expect(commonHelpers.prepareResponse).toHaveBeenCalledWith(
      StatusCodes.OK,
      "SUCCESS",
      {
        taskList: [{ id: "encryptedId", title: "Test Task" }],
        loadMore: false,
        count: mockCount,
      }
    );
    expect(result).toBe(mockResponse);
  });

  test("should handle error when getting task list fails", async () => {
    const userId = 1;
    const reqQuery = { pageNo: 1, search: "Test" };

    const mockError = new Error("Failed to get task list");

    taskModel.fetchTasks.mockRejectedValue(mockError);

    const result = await taskService.getTaskList(userId, reqQuery);

    expect(taskModel.fetchTasks).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(mockError);
    expect(result).toBe(mockError);
  });
});

describe("unit testing for taskService/getTask", () => {
  test("should get task successfully", async () => {
    const userId = 1;
    const reqParams = { id: "encryptedId" };

    const decodedTaskId = 123;
    const mockTask = {
      title: "Test Task",
      description: "Test Description",
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockResponse = {
      status: StatusCodes.OK,
      message: "SUCCESS",
      data: mockTask,
    };

    commonHelpers.decrypt.mockReturnValue(decodedTaskId);
    taskModel.fetchObjWithSingleRecord.mockResolvedValue(mockTask);
    commonHelpers.prepareResponse.mockResolvedValue(mockResponse);

    const result = await taskService.getTask(userId, reqParams);

    expect(commonHelpers.decrypt).toHaveBeenCalledWith("encryptedId");
    expect(taskModel.fetchObjWithSingleRecord).toHaveBeenCalledWith(
      { id: decodedTaskId, userId: userId },
      "title, description, status, createdAt, updatedAt",
      tableConstants.TASKS
    );
    expect(commonHelpers.prepareResponse).toHaveBeenCalledWith(
      StatusCodes.OK,
      "SUCCESS",
      mockTask
    );
    expect(result).toBe(mockResponse);
  });

  test("should handle invalid task ID", async () => {
    const userId = 1;
    const reqParams = { id: "encryptedId" };

    const decodedTaskId = 123;
    const mockResponse = {
      status: StatusCodes.BAD_REQUEST,
      message: "INVALID_TASK_ID",
    };

    commonHelpers.decrypt.mockReturnValue(decodedTaskId);
    taskModel.fetchObjWithSingleRecord.mockResolvedValue(null);
    commonHelpers.prepareResponse.mockResolvedValue(mockResponse);

    const result = await taskService.getTask(userId, reqParams);

    expect(commonHelpers.decrypt).toHaveBeenCalledWith("encryptedId");
    expect(taskModel.fetchObjWithSingleRecord).toHaveBeenCalledWith(
      { id: decodedTaskId, userId: userId },
      "title, description, status, createdAt, updatedAt",
      tableConstants.TASKS
    );
    expect(commonHelpers.prepareResponse).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      "INVALID_TASK_ID"
    );
    expect(result).toBe(mockResponse);
  });

  test("should handle error when getting task fails", async () => {
    const userId = 1;
    const reqParams = { id: "encryptedId" };

    const mockError = new Error("Failed to get task");

    commonHelpers.decrypt.mockReturnValue(123);
    taskModel.fetchObjWithSingleRecord.mockRejectedValue(mockError);

    const result = await taskService.getTask(userId, reqParams);

    expect(taskModel.fetchObjWithSingleRecord).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(mockError);
    expect(result).toBe(mockError);
  });
});

describe("unit testing for taskService/deleteTask", () => {
  test("should delete task successfully", async () => {
    const userId = 1;
    const reqParams = { id: "encryptedId" };

    const decodedTaskId = 123;
    const mockResponse = { status: StatusCodes.OK, message: "SUCCESS" };

    commonHelpers.decrypt.mockReturnValue(decodedTaskId);
    taskModel.fetchObjWithSingleRecord.mockResolvedValue({ id: decodedTaskId });
    taskModel.deleteObj.mockResolvedValue();
    commonHelpers.prepareResponse.mockResolvedValue(mockResponse);

    const result = await taskService.deleteTask(userId, reqParams);

    expect(commonHelpers.decrypt).toHaveBeenCalledWith("encryptedId");
    expect(taskModel.fetchObjWithSingleRecord).toHaveBeenCalledWith(
      { id: decodedTaskId, userId: userId },
      "id",
      tableConstants.TASKS
    );
    expect(taskModel.deleteObj).toHaveBeenCalledWith(
      { id: decodedTaskId },
      tableConstants.TASKS
    );
    expect(commonHelpers.prepareResponse).toHaveBeenCalledWith(
      StatusCodes.OK,
      "SUCCESS"
    );
    expect(result).toBe(mockResponse);
  });

  test("should handle invalid task ID", async () => {
    const userId = 1;
    const reqParams = { id: "encryptedId" };

    const decodedTaskId = 123;
    const mockResponse = {
      status: StatusCodes.BAD_REQUEST,
      message: "INVALID_TASK_ID",
    };

    commonHelpers.decrypt.mockReturnValue(decodedTaskId);
    taskModel.fetchObjWithSingleRecord.mockResolvedValue(null);
    commonHelpers.prepareResponse.mockResolvedValue(mockResponse);

    const result = await taskService.deleteTask(userId, reqParams);

    expect(commonHelpers.decrypt).toHaveBeenCalledWith("encryptedId");
    expect(taskModel.fetchObjWithSingleRecord).toHaveBeenCalledWith(
      { id: decodedTaskId, userId: userId },
      "id",
      tableConstants.TASKS
    );
    expect(commonHelpers.prepareResponse).toHaveBeenCalledWith(
      StatusCodes.BAD_REQUEST,
      "INVALID_TASK_ID"
    );
    expect(result).toBe(mockResponse);
  });

  test("should handle error when deleting task fails", async () => {
    const userId = 1;
    const reqParams = { id: "encryptedId" };

    const mockError = new Error("Failed to delete task");

    commonHelpers.decrypt.mockReturnValue(123);
    taskModel.fetchObjWithSingleRecord.mockResolvedValue({ id: 123 });
    taskModel.deleteObj.mockRejectedValue(mockError);

    const result = await taskService.deleteTask(userId, reqParams);

    expect(taskModel.deleteObj).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(mockError);
    expect(result).toBe(mockError);
  });
});
  