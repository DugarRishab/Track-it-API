const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const Team = require('./../models/teamModel');
const Task = require('./../models/taskModel');
const Project = require('./../models/projectModel');
const log = require('./../utils/colorCli');
const uid = require('./../utils/generateUID');

exports.getAllUsers = catchAsync(async (req, res, next) => {

	let query;
	const { companyId } = req.user;
	
	if(req.user.adminStatus !== 'director') {
		query = { companyId };
	}

	const users = await User.find(query);

	const teams = await Team.find({companyId});
	console.log(log.debug(teams));

	users.forEach(user => {
		teams.forEach(team => {
			if (team.members.includes(user.id)) {
				user.teams.push(team.id);
			}
		});
	});

	res.status(200).json({
		message: 'success',
		items: users.length,
		data: {
			users
		}
	});
});
exports.changeAdminStatus = catchAsync(async (req, res, next) => {
	const { userId, newAdminStatus } = req.body;
	if (!userId || !newAdminStatus) {
		return next(new AppError('Please provide userId and newAdminStatus', 400));
	}

	const user = await User.findById(userId);
	if (!user) {
		return next(new AppError('User does not exists', 400));
	}

	if (req.user.companyId !== user.companyId) {
		return next(new AppError('User does not exists in your company'));
	}

	if (newAdminStatus === 'director') {
		return next(new AppError('You do not have permission to make a new "director" ', 401));
	}

	user.adminStatus = newAdminStatus;

	await User.findByIdAndUpdate(user.id, user, {
		new: true
	});

	res.status(200).json({
		message: 'success',
		data: {
			user
		}
	});
});
exports.updateMe = catchAsync(async (req, res, next) => {
	
	const user = await User.findByIdAndUpdate(req.user.id, req.body, {
		new: true
	});

	


});
exports.correctData = catchAsync(async (req, res, next) => {
	// const projects = await Project.find();

	// projects.forEach(async (project) => {
	// 	try {
	// 		if (!project.projectId) {
				
	// 			//const projectId = project.companyId.split('-')[1];
	// 			project.projectId = `P-${uid(6)}`
	// 			console.log(log.debug(project.name, project.projectId));
	// 			// const projectId = `U-${uid(8)}`;
	// 			// project.projectId = projectId;
	// 			await Project.findByIdAndUpdate(project.id, project, {
	// 				runValidators: true
	// 			});
	// 		}
	// 	}
	// 	catch (err) {
	// 		return next(new AppError(err, 400));
	// 	}
	// });
	// res.status(200).json({
	// 	//message: 'success'
	// 	message: 'success'
	// });
});
exports.getUser = catchAsync(async (req, res, next) => {
	const { userId } = req.params;
	const { companyId } = req.user;
	
	const user = await User.findOne({ userId, companyId });
	const teams = await Team.find({ companyId }).select('name members');
	const tasks = await Task.find({ companyId });
	const userTeams = [];
	const userTasks = [];
	
	//user.teams.push(teams.filters(team => team.members.includes(user.id)));
	userTeams.push(teams.filter(team => team.members.includes(user.id)));

	userTeams.forEach(userTeam => {
		userTasks.push(tasks.filter(task => (task.assignedTo.includes(user.userId) || task.assignedTo.includes(userTeam.teamId))));
		user.teams.push(userTeam.id);
	});

	res.status(200).json({
		message: 'success',
		data: {
			user,
			teams: userTeams,
			tasks: userTasks
		}
	});

});