const express = require('express');
const teamController = require('../controllers/teamController');
const authController = require('./../controllers/authController');

const Router = express.Router();

Router
	.route('/')
	.get(authController.protect, teamController.getCompanyTeams)
	.post(authController.protect,
		authController.restrictTo('admin', 'administrator'),
		teamController.createTeam);

module.exports = Router;