const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Project = require('./../models/projectModel');
const Team = require('./../models/teamModel');
const User = require('./../models/userModel');
const log = require('./../utils/colorCli');
const uid = require('./../utils/generateUID');

exports.createTeam = catchAsync(async (req, res, next) => {
	
	const { user } = req;
	const members = req.body.members || [];
	if (members.length === 0) {
		members.forEach(async (id) => {
			const member = await User.findById(id);
			if (!member) {
				return next(new AppError(`the user with id - ${id} doesnot exists`, 404));
			}
		})
	}
	members.push(user.id);

	const team = await Team.create({
		name: req.body.name,
		description: req.body.description,
		project: req.body.project,
		teamId: `T-${uid(8)}`,
		members,
		admin: user.id
	});

	res.status(201).json({
		message: 'success',
		data: {
			team
		}
	});
});
exports.getAllTeams = catchAsync(async (req, res, next) => {

	const teams = await Team.find().populate({
		path: 'members',
		select: 'name status adminStatus image userId'
	});

	res.status(200).json({
		message: 'success',
		data: {
			number: teams.length,
			teams
		}
	});
});
exports.getUserTeams = catchAsync(async (req, res, next) => {
	const { user } = req;
	const teams = await Team.find({members: user.id}).populate({
		path: 'members',
		select: 'name status adminStatus image userId',
	});

	res.status(200).json({
		message: 'success',
		data: {
			number: teams.length,
			teams,
		},
	});
});
exports.addUser = catchAsync(async (req, res, next) => {
	
});