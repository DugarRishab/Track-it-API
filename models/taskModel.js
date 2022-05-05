const mongoose = require('mongoose');
const log = require('./../utils/colorCli');
//const slugify = require('slugify');

const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'task must have a name']
	},
	assignedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'task must be assignedBy someone']
	},
	assignedTo: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User',
		required: [true, 'task must be assignedTo someone'],
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
		required: [ true, 'task must have a end date']
	},
	assignedOn: {
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
	description: String,
	files: [String],
	completed: {
		type: Boolean,
		default: false
	},
	projectId: String,
	companyId: String,
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