const express = require('express');
const companyController = require('../controllers/companyController');

const Router = express.Router();

Router
	.route('/')
	.get(companyController.getAllCompanies)
	.post(companyController.createCompany)
	// .patch(userController.updateUser)
	// .delete(userController.deleteUser);

// Router.route('/:id').get(userController.get)

module.exports = Router;