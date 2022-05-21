const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Project = require('./../models/projectModel');
const User = require('./../models/userModel');
const log = require('./../utils/colorCli');
const uid = require('./../utils/generateUID');

exports.createProject = catchAsync(async (req, res, next) => {

	const { user } = req;

	const project = await Project.create({
		name: req.body.name,
		description: req.body.description,
		admin: user.id,
		projectId: `P-${uid(6)}`,
		users: req.body.users
	});

	res.status(201).json({
		message: 'success',
		data: {
			project
		}
	});
	
});
exports.getUserProjects = catchAsync(async (req, res, next) => {
	const { user } = req;

	const projects = await Project.find({ $or: [{ users: user }, { admin: user }] });

	res.status(200).json({
		message: 'success',
		data: {
			projects
		}
	});
});