import { StatusCodes } from "http-status-codes";
import tableConstants from '~/constants/tableConstants';
import commonConstants from '~/constants/commonConstants';

class taskService {
  constructor({ DateTimeUtil, logger, commonHelpers, taskModel }) {
    this.DateTimeUtil = DateTimeUtil;
    this.logger = logger;
    this.commonHelpers = commonHelpers;
    this.taskModel = taskModel;
  }

  /*
   Save task service
   @requestData request body data
  */
  async saveTask(requestData) {
    try {
      // Destructure requestData object
      const { title, description, status, userId } = requestData;
      const taskData = {
        title,
        description,
        status,
        userId:userId,
        createdAt: this.DateTimeUtil.getCurrentTimeObjForDB()
      };
      // Create new task in the database
      await this.taskModel.createObj(taskData, tableConstants.TASKS);
      // Return success response
      return await this.commonHelpers.prepareResponse(
        StatusCodes.OK,
        "SUCCESS"
      );
    } catch (error) {
      // Log error if any occurs
      this.logger.error(error);
      // Return the error
      return error;
    }
  }

  /*
   Update task service
   @requestData request body data
   @reqParams request
  */
  async updateTask(requestData, reqParams) {
    try {

      // Decrypt id
      const decodedTaskId = this.commonHelpers.decrypt(reqParams.id);
      // Check if taskId is valid by fetching from the database
      const isValidTaskId = await this.taskModel.fetchObjWithSingleRecord(
        { id: decodedTaskId, userId: requestData.userId },
        "id",
        tableConstants.TASKS
      );

      // If taskId is not valid, return an error response
      if (!isValidTaskId) {
        return await this.commonHelpers.prepareResponse(
          StatusCodes.BAD_REQUEST,
          "INVALID_TASK_ID"
        );
      }

      // Destructure requestData object
      const { title, description, status } = requestData;
      const taskData = {
        title,
        description,
        status,
        updatedAt: this.DateTimeUtil.getCurrentTimeObjForDB()
      };
      // Update task in the database
      await this.taskModel.updateObj(
        taskData,
        { id: decodedTaskId },
        tableConstants.TASKS
      );
      // Return success response
      return await this.commonHelpers.prepareResponse(
        StatusCodes.OK,
        "SUCCESS"
      );
    } catch (error) {
      // Log error if any occurs
      this.logger.error(error);
      // Return the error
      return error;
    }
  }

  /*
   Get task list service
   @reqQuery request pageNo, search
  */
  async getTaskList(userId, reqQuery) {
    try {
      const where={
        userId:userId
      }

      let search = reqQuery.search,
          pageNo = reqQuery.pageNo;
      
      if (pageNo <= 0 || pageNo == undefined) {
          pageNo = 1;
      }

      let limit = commonConstants.DEFAULT_PAGINATION_LIMIT,
      offset = (pageNo - 1) * limit;

      if (search != "" && search != undefined) {
        var searchValue = search.trim();
        var searchQuery = `(title LIKE '%${searchValue}%' OR description LIKE '%${searchValue}%' OR status LIKE '%${searchValue}%')`;
      } else {
        var searchQuery = "";
      }

      // Fetch task list based on the query conditions
      const taskList = await this.taskModel.fetchTasks(where, offset, false, searchQuery);
      
      // Fetch total count of task data
      const taskCount = await this.taskModel.fetchTasks(where, offset, true, searchQuery);

      // Check task list data exist or not
      if (taskList) {
          taskList.forEach(item => {
            item.id = this.commonHelpers.encrypt(item.id)
          });
      }
      
      const totalData = offset + limit;
      let loadMore = false;
            
      if (totalData < taskCount) {
        loadMore = true;
      }

      // Return success response
      return await this.commonHelpers.prepareResponse(
        StatusCodes.OK,
        "SUCCESS",
        {taskList, loadMore, count:taskCount}
      );

    } catch (error) {
      // Log any errors that occur
      this.logger.error(error);
      // Return the error object
      return error;
    }
  }

  /*
   Get a task service
   @reqParams request
  */
   async getTask(userId, reqParams) {
    try {

      // Decrypt task id
      const decodedTaskId = this.commonHelpers.decrypt(reqParams.id);
      // Check if taskId is valid by fetching from the database
      const task = await this.taskModel.fetchObjWithSingleRecord(
        { id: decodedTaskId, userId: userId },
        "title, description, status, createdAt, updatedAt",
        tableConstants.TASKS
      );

      // If taskId is not valid, return an error response
      if (!task) {
        return await this.commonHelpers.prepareResponse(
          StatusCodes.BAD_REQUEST,
          "INVALID_TASK_ID"
        );
      }

      // Return success response
      return await this.commonHelpers.prepareResponse(
        StatusCodes.OK,
        "SUCCESS",
        task
      );

    } catch (error) {
      // Log any errors that occur
      this.logger.error(error);
      // Return the error object
      return error;
    }
  }

  /*
   Delete task service
   @reqParams request
  */
  async deleteTask(userId, reqParams) {
    try {

      const where={
        userId: userId,
        id: this.commonHelpers.decrypt(reqParams.id)
      }

      // Fetch the task object with the given ID
      let isValidTaskId = await this.taskModel.fetchObjWithSingleRecord(where, "id", tableConstants.TASKS);

      // Check if the task ID is valid
      if(!isValidTaskId){
        // Return a bad request response if the task ID is invalid
        return await this.commonHelpers.prepareResponse(
          StatusCodes.BAD_REQUEST,
          "INVALID_TASK_ID"
        );  
      }

      // Delete the task
      await this.taskModel.deleteObj(
        {id:where.id},
        tableConstants.TASKS
      );

      // Return a success response after successful deletion
      return await this.commonHelpers.prepareResponse(
        StatusCodes.OK,
        "SUCCESS"
      );

    } catch (error) {
      // Log any errors that occur
      this.logger.error(error);
      // Return the error object
      return error;
    }
  }
}

module.exports = taskService;