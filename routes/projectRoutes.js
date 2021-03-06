const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('./../controllers/authController');

const Router = express.Router();

Router.route('/').post(authController.protect, projectController.createProject);
Router.route('/').get(authController.protect, projectController.getUserProjects);

module.exports = Router;