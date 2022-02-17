const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Project = require('./../models/projectModel');
const User = require('./../models/userModel');
const log = require('./../utils/colorCli');
const uid = require('./../utils/generateUID');

exports.createProject = catchAsync(async (req, res, next) => {

	const { user } = req;

	if (!req.body.companyId) {
		req.body.companyId = user.companyId;
	}
	if (user.companyId !== req.body.companyId) {
		return next(new AppError('You cannot create project in another company', 401));
	}
	const project = await Project.create({
		name: req.body.name,
		description: req.body.description,
		manager: req.body.manager,
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		active: req.body.active,
		companyId: req.body.companyId,
		projectId: `P-${uid(6)}`,
		members: req.body.members
	});

	const {members} = req.body;
	members.forEach(catchAsync(async (id) => {
		//console.log(log.debug('id is'), log.debug(id));
		const member = await User.findById(id);
		//console.log(log.debug(member.projects));
		if (!member) {
			return next(new AppError(`the user ${id} doesnot exists`, 404));
		}
		member.projects.push(project.id);

		await User.findByIdAndUpdate(id, member, {
			runValidators: true
		});
	}));

	res.status(201).json({
		message: 'success',
		data: {
			project
		}
	})
	
	
});