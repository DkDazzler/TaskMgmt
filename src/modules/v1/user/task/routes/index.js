import { Router } from "express";
import { saveTaskValidator } from "!/user/task/validators/saveTaskValidator";

// create object for task controller routes
const task = new Router();

// Import the container
const container = require('~/dependency'),
        taskController = container.resolve("taskController"),
        checkApiHeaders = container.resolve("checkApiHeaders"),
        jwtVerifyToken = container.resolve("jwtVerifyToken");

/*
* create routes for saveTask method in taskController
*/
task.post('/tasks', checkApiHeaders, jwtVerifyToken, saveTaskValidator, (req, res, next) => { taskController.saveTask(req, res, next); });

/*
* create routes for updateTask method in taskController
*/
task.put('/tasks/:id', checkApiHeaders, jwtVerifyToken, saveTaskValidator, (req, res, next) => { taskController.updateTask(req, res, next); });

/*
* create routes for getTaskList method in taskController
*/
task.get('/tasks', checkApiHeaders, jwtVerifyToken, (req, res, next) => { taskController.getTaskList(req, res, next); });

/*
* create routes for getTask method in taskController
*/
task.get('/tasks/:id', checkApiHeaders, jwtVerifyToken, (req, res, next) => { taskController.getTask(req, res, next); });

/*
* create routes for deleteTask method in taskController
*/
task.delete('/tasks/:id', checkApiHeaders, jwtVerifyToken, (req, res, next) => { taskController.deleteTask(req, res, next); });

export { task };