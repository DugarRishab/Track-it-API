const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Project = require('./../models/projectModel');
const Team = require('./../models/teamModel');
const User = require('./../models/userModel');
const log = require('./../utils/colorCli');
const uid = require('./../utils/generateUID');

exports.createTeam = catchAsync(async (req, res, next) => {
	if (req.body.companyId) {
		if (req.body.companyId !== req.user.companyId) {
			return next(new AppError('You cannot create a team in another company', 400));
		}
	}
	else {
		req.body.companyId = req.user.companyId;
	}
	if (req.body.projectId) {
		const project = await Project.findOne({ projectId: req.body.projectId });
		if (project.companyId !== req.body.companyId) {
			return next(new AppError('You cannot create a team in project of another company', 400));
		}
	}
	if (req.body.members) {
		req.body.members.forEach(async (id) => {
			const member = await User.findById(id);
			if (!member) {
				return next(new AppError(`the user with id - ${id} doesnot exists`, 404));
			}
			if (member.companyId !== req.body.companyId) {
				return next(new AppError('You cannot include a member of another company in your team'));
			}
			if (req.body.projectId && member.projects.includes(req.body.projectId)) {
				return next(new AppError('You cannot include a member of another project in your team, else create your team outside of any project'));
			}
		})
	}
	const team = await Team.create({
		name: req.body.name,
		description: req.body.description,
		leader: req.body.leader,
		companyId: req.body.companyId,
		projectId: req.body.projectId,
		teamId: `T-${uid(8)}`,
		members: req.body.members
	});

	res.status(201).json({
		message: 'success',
		data: {
			team
		}
	});
});
exports.getCompanyTeams = catchAsync(async (req, res, next) => {

	const teams = await Team.find({ companyId: req.user.companyId }).populate({
		path: 'members',
		select: 'name role adminStatus image userId'
	});

	res.status(200).json({
		message: 'success',
		number: teams.length,
		data: {
			teams
		}
	});
});