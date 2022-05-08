const express = require('express');
const teamController = require('../controllers/teamController');
const authController = require('./../controllers/authController');

const Router = express.Router();

Router
	.route('/')
	.get(authController.protect, teamController.getUserTeams)
	.post(authController.protect, teamController.createTeam);

module.exports = Router;