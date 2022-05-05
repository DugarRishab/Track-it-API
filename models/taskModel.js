const mongoose = require('mongoose');
//const slugify = require('slugify');

const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please provide the title of the Task'],
		trim: true,
	},
	assignedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Task must be assigned by someone']
	},
	assignedTo: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User',
		required: [true, 'Task must be assigned to someone'],
		validate: {
			validator: function (val) {
				return (val.length !== 0);
			},
			message: 'Task must be assigned to someone'
		}
	},
	startDate: {
		type: Date,
		default: Date.now(),
	},
	endDate: {
		type: Date,
		required: [ true, 'Please provide a end date for a Task']
	},
	dateCreated: {
		type: Date,
		default: Date.now()
	},
	reminder: {
		type: Boolean,
		default: false
	},
	myDay: {
		type: Boolean,
		default: false
	},
	steps: [String],
	description: {
		type: String,
		trim: true,
	},
	files: [String],
	status: {
		type: String,
		default: "due",
		enum: ['due', 'done', 'in-progress']
	},
	progress: {
		type: Number,
		default: 0
	},
	tags: {
		type: [String],
		required: [true, "Task must have atleast 1 tag"],
		validate: {
			validator: function (val) {
				return (val.length !== 0);
			},
			message: 'Task must have atleast 1 tag'
		}
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	},
	team: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Team'
	},
	taskId: String
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

taskSchema.virtual('durationInTime').get(function () {
	const durationInTime = this.endDate - this.startDate;
	return durationInTime;
});
taskSchema.virtual('durationInDays').get(function () {

	const durationInDays = Math.floor(this.durationInTime / (1000 * 3600 * 24));
	return durationInDays;
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;