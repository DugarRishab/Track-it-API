const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const Team = require('./../models/teamModel');
const Task = require('./../models/taskModel');
const Project = require('./../models/projectModel');
const log = require('./../utils/colorCli');
const uid = require('./../utils/generateUID');
const dateToString = require('./../utils/dateToString');

const connectSrc = process.env.CSP_CONNECT_SRC;

exports.getLandingPage = catchAsync(async (req, res) => {	// TODO: Check if User already logged in, if yes send him to dashboard directly
	res
		.status(200)
		.set(													
			'content-Security-Policy',		
			`connect-src ${connectSrc}`
		)
		.render('landing');	
});
exports.getTaskPage = catchAsync(async (req, res, next) => {

	const { user } = res.locals;

	if (user) {
		res
			.status(200)
			.set(
				'content-Security-Policy',
				`connect-src ${connectSrc}`
			)
			.render('tasks', {
				user
			});
	}

	else {
		res
			.status(200)
			.set(
				'content-Security-Policy',
				`connect-src ${connectSrc}`
			)
			.render('login', {});
	
	}
	
	
});