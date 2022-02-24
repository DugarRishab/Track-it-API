const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('./../controllers/authController');

const Router = express.Router();

Router.route('/admin/:pass')

Router.route('/')
	.post(authController.protect, taskController.createTask)
	.get(authController.protect, taskController.getCompanyTasks);

Router.route('/:taskId')
	.patch(authController.protect, taskController.updateTask)
	.delete(authController.protect, taskController.deleteTask)

Router.get('/complete/:taskId', authController.protect, taskController.markComplete);

Router.route('/getMyTasks').get(authController.protect, taskController.getUserTasks);


module.exports = Router;