/* eslint-disable no-console */
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Task = require('./../models/taskModel');
const User = require('./../models/userModel');
const Project = require('./../models/projectModel');
const Team = require('./../models/teamModel');
const log = require('./../utils/colorCli');
const uid = require('./../utils/generateUID');

exports.createTask = catchAsync(async (req, res, next) => {		// TODO: Update: the controller to accept a Team, but also save the names of user in the team
																
	const assignedBy = req.user;								// TODO: Update: Also save the taskId in Users
	//console.log(log.debug(assignedBy));


	req.body.assignedTo.forEach(catchAsync(async (id) => {
		const user = await User.find({
			id: id,
			companyId: assignedBy.companyId
		});
		const team = await Team.find({
			id: id,
			companyId: assignedBy.companyId
		})
		if (!user && !team) {
			return next(new AppError(`the user/team with Id: ${id} , doesnot exists in your company`, 400));
		}
	}));

	if (req.body.companyId && req.body.companyId !== assignedBy.companyId) {
		return next(new AppError('you cannot create a task in another company', 400));
	}
	if (!req.body.companyId) {
		//console.log(log.debug('no id found'));
		req.body.companyId  =  assignedBy.companyId
	}
	//console.log(log.debug(req.body.companyId))

	
	//console.log("type of object found: ", typeof req.body.assignedTo, Array.isArray(req.body.assignedTo), req.body.assignedTo);

	//const { assignedTo } = req.body;

	const task = await Task.create({
		title: req.body.title,
		assignedTo: req.body.assignedTo,
		assignedBy: `${assignedBy.id}`,
		startDate: req.body.startDate,
		endDate: req.body.endDate,
		reminder: req.body.reminder,
		myDay: req.body.myDay,
		description: req.body.description,
		files: req.body.files,
		steps: req.body.steps,
		completed: req.body.completed,
		assignedOn: req.body.assignedOn,
		importance: req.body.importance,
		projectId: req.body.projectId,
		companyId: req.body.companyId,
		taskId: `TSK-${uid(12)}`
	});

	res.status(200).json({
		message: 'success',
		data: {
			task
		}
	});  

});
exports.getCompanyTasks = catchAsync(async (req, res, next) => {
	const { user } = res.locals;
	//console.log(log.success("Current user: ", user.userId));

	const tasks = await Task.find({ companyId: user.companyId });

	res.status(200).json({
		message: 'success',
		data: [
			tasks
		]
	});  
});
exports.getUserTasks = catchAsync(async (req, res, next) => {
	
	const { user } = res.locals;
	//console.log(log.success("Current user: ", user.userId, ": ", user.name));
	const tasks = await Task.find({ companyId: user.companyId })
		.populate({
			path: 'assignedBy assignedTo'
		});
	//console.log("Tasks: ", tasks);
	const users = await User.find({ companyId: user.companyId });
	//console.log(user);
	//const userTasks = [];
	// tasks.forEach(task => {
	// 	console.log((task.assignedBy),"\n");
	// });

	let teams = await Team.find({ companyId: user.companyId });
	teams = teams.filter(team => (team.members.includes(user.id)));

	//console.log(log.debug(typeof users));
	const projects = await Project.find({ companyId: user.companyId });
	const userProjects = [];
	projects.forEach(project => {
		if(user.projects.includes(project.id))
			userProjects.push( project);
	});

	const assignedToUserTasks = [];
	// assignedToUserTasks = (tasks.filter(task =>
	// {	
	// 	// console.log(log.debug("!!!Added!!!"));
	// 	const returnType = task.assignedTo.filter(assignee => {
	// 		if (assignee.userId && assignee.userId === user.userId)
	// 			return true;
	// 		teams.forEach(team => {
	// 			if (assignee.teamId === team.id)
	// 				return true;
	// 		});
	// 		return false;
	// 	});
	// 	// console.log(returnType);

	// 	//return false;
	// }));
	tasks.forEach(task => {
		task.assignedTo.forEach(assignee => {
			if (assignee.userId && assignee.userId === user.userId) {
				assignedToUserTasks.push(task);
				return;
			}
			teams.forEach(team => {
				if (assignee.teamId === team.id) {
					assignedToUserTasks.push(task);
				}
			});
		});
	});
	console.log(log.debug("assigned to user taks length: ", assignedToUserTasks.length, "type: ", typeof assignedToUserTasks));
	// teams.forEach(team => {
	// 	assignedToUserTasks.push(tasks.filter(					// TODO: Check for duplicate Values
	// 		task => (task.assignedTo.includes(team.teamId))
	// 	));
	// });

	//assignedToUserTasks = new Set(assignedToUserTasks);
	const assignedByUserTasks = tasks.filter(task => (task.assignedBy.userId === user.userId));
	//console.log(log.debug("assignedBy user tasks:", typeof assignedByUserTasks));
	
	// assignedToUserTasks.forEach(task => {
	// 	task.assignedByUser = users.find(u => (u.userId === task.assignedBy));
	// });

	// assignedToUserTasks.forEach(task => {
	// 	task.assignedToUser = [];
	// 	const newTask = {
	// 		assignedToUser: []
	// 	}
	// 	//const abc = task.assignedTo;
	// 	//console.log(log.debug("type of assigned TO: ", Array.isArray(abc), abc[0]));
		
	// 	//task.assignedTo = JSON.parse(`{${task.assignedTo}}`);
	// 	//console.log("New type of assigned TO: ", typeof task.assignedTo, task.assignedTo);


	// 	if (Array.isArray(task.assignedTo)) {
	// 		task.assignedTo.forEach(a => {
	// 			task.assignedToUser.push(users.find(u => (u.userId === a)));
	// 			console.log("Assigning user");
	// 		});
	// 	}
	// 	//task = {}
		
	// 	//console.log(task);

		
	// });
	//console.log("task being sent: ", assignedToUserTasks);

	
	//const currentTaskList = assignedToUserTasks;
	res.status(200).json({
		message: 'success',
		data: {
			assignedByUserTasks,
			assignedToUserTasks,
			projects: userProjects
		}
	});

	//console.log(log.success("res sent"));
		
})
exports.markComplete = catchAsync(async (req, res, next) => {
	
	const { user } = req;
	const { taskId } = req.params;

	const task = await Task.findOne({ taskId });

	if (!task) {
		return next(new AppError('This task doesnot exists', 404));
	}
	//console.log('assigned By:', user.id, " and ", task.assignedBy);
	if (!task.assignedTo.includes(user.id)) {
		return next(new AppError('You donot have access to this task', 401));
	}

	const updatedTask = await Task.findOneAndUpdate({ taskId }, { completed: true }, { new: true });

	res.status(200).json({
		message: "success",
		data: {
			task: updatedTask
		}
	});
	
});
exports.deleteTask = catchAsync(async (req, res, next) => {
	const { user } = req;
	const { taskId } = req.params;

	const task = await Task.findOne({ taskId });

	if (!task) {
		return next(new AppError('This task doesnot exists', 404));
	}
	console.log('assigned By:', user.id, " and ", task.assignedBy);
	if (`${task.assignedBy}` !== user.id) {
		return next(new AppError('You donot have access to this task', 401));
	}

	await Task.findOneAndDelete({ taskId });

	res.status(200).json({
		message: 'success'
	});

});
exports.updateTask = catchAsync(async (req, res, next) => {

	const { user } = req;
	const { taskId } = req.params;
	const { body } = req;

	//console.log(body);

	const task = await Task.findOne({ taskId });

	if (!task) {
		return next(new AppError('This task doesnot exists', 404));
	}
	//console.log('assigned By:', user.id, " and ", task.assignedBy);
	if (`${task.assignedBy}` !== user.id) {
		return next(new AppError('You donot have access to this task', 401));
	}
	// eslint-disable-next-line no-prototype-builtins
	if (body.hasOwnProperty('completed')) {
		//console.log(body.completed);
		if (!task.assignedTo.includes(user.id)) {
			return next(new AppError('You cannot change this property', 401));
		}
	}

	const updatedTask = await Task.findOneAndUpdate({ taskId }, body, {
		new: true,
		runValidators: true
	});

	res.status(200).json({
		message: 'success',
		data: {
			task: updatedTask
		}
	});
});
