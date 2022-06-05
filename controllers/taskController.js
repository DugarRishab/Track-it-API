/* eslint-disable no-console */
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Task = require('./../models/taskModel');
const User = require('./../models/userModel');
const Project = require('./../models/projectModel');
const Team = require('./../models/teamModel');
const log = require('./../utils/colorCli');
const uid = require('./../utils/generateUID');
const { cloudinary } = require('../utils/cloudinary');


exports.createTask = catchAsync(async (req, res, next) => {		
																
	const assignedBy = req.user;	
	const { assignedTo } = req.body;

	assignedTo.forEach(async (id) => {
		
		try {
			console.log('next', next);
			const user = await User.findById(id);
			if (!user) {
				return next(
					new AppError(
						`The user with Id: ${id} , doesnot exists.`,
						400
					)
				);
			}
			
		}
		catch (err) {	
		 	next(
				err
			);
		}
		
		// if (!user) {
		// 	return next(new AppError(`the user with Id: ${id} , doesnot exists.`, 400));
		// }
	});

	if (req.body.team) {
		const team = await Team.findById(req.body.team);
		if (!team) {
			return next(
				new AppError(`the team with Id: ${req.body.team} , doesnot exists.`, 400)
			);
		}

		team.members.forEach(user => {
			assignedTo.push(user);
		})
	}
	console.log(req.body.image);
	const uploadRes = await cloudinary.uploader.upload(req.body.image, {
		upload_preset: "task_imgs"
	});
	console.log(uploadRes);

	const task = await Task.create({
		title: req.body.title,
		assignedTo,
		assignedBy: `${assignedBy.id}`,
		startDate: req.body.startDate,
		endDate: req.body.endDate,
		reminder: req.body.reminder,
		myDay: req.body.myDay,
		description: req.body.description,
		steps: req.body.steps,
		assignedOn: req.body.assignedOn,
		project: req.body.project,
		team: req.body.team,
		taskId: `TSK-${uid(12)}`,
		tags: req.body.tags,
		subTasks: req.body.subTasks,
		images: [uploadRes?.url]
	});

	res.status(200).json({
		message: 'success',
		data: {
			task
		}
	});  

});
exports.getAllTasks = catchAsync(async (req, res, next) => {
	const { user } = res.locals;

	const tasks = await Task.find();

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
	const assignedToUserTasks = await Task.find({ assignedTo: user.id })
		.populate({
			path: 'assignedBy assignedTo team project'
		});
	
	const assignedByUserTasks = await Task.find({ assignedBy: user.id })
		.populate({
			path: 'assignedBy assignedTo team project'
		});
	
	res.status(200).json({
		message: 'success',
		data: {
			assignedByUserTasks,
			assignedToUserTasks,
		}
	});	
})
exports.markComplete = catchAsync(async (req, res, next) => {
    const { user } = req;
    const { taskId } = req.params;
    console.log('taskId: ', taskId);
    const task = await Task.findById(taskId);

    if (!task) {
        return next(new AppError('This task doesnot exists', 404));
    }

    if (!task.assignedTo.includes(user.id)) {
        return next(new AppError('You donot have access to this task', 401));
    }

    let updatedTask;
    if (task.status !== 'done') {

        task.status = 'done';
        const subTasks = task.subTasks.map((subTask) => {
			subTask.status = 'done';
			return subTask;
        });
        // console.log(task);
		updatedTask = await Task.findByIdAndUpdate(taskId, {
			status: 'done',
			subTasks
		}, {
            new: true,
        }).populate({
            path: 'assignedBy assignedTo team project',
        });

    } else {

        task.status = 'due';
        const subTasks = task.subTasks.map((subTask) => {
			subTask.status = 'done';
			return subTask;
        });
        // console.log(task);
        updatedTask = await Task.findByIdAndUpdate(taskId, {
			status: "due",
			subTasks
		}, {
            new: true,
        }).populate({
            path: 'assignedBy assignedTo team project',
		});
		
    }
    console.log(updatedTask.status);
	console.log(updatedTask);
    res.status(200).json({
        message: 'success',
        data: {
            task: updatedTask,
        },
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
