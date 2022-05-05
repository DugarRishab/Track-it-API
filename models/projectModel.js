const mongoose = require('mongoose');
//const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const uid = require('./../utils/generateUID');

const projectSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A project must have a name'],
		trim: true,
		minLength: [4, 'Name must have atleat - 4 characters']
	},
	description: {
		type: String,
		maxLength: [250, 'Description must not have more than 250 charachters'],
	},
	companyId: {
		type: String,
		required: [true, 'A project must belong to a company']
	},
	manager: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'A project must have a manager']
	},
	
	startTime: {
		type: Date,
		default: Date.now()
	},
	endTime: {
		type: Date,
		required: [true, 'A project must have a endTime']
	},
	active: {
		type: Boolean,
		default: true
	},
	projectId: {
		type: String,
		//required: [true, 'Every Project must have a UID']
	},
	members: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User'
	}
});

projectSchema.virtual('duration').get(function () {
	return (this.endTime - this.startTime);
});

// projectSchema.virtual('members', {	// <- This is virtual populate
// 	ref: 'User',
// 	foreignField: 'tour',
// 	localField: '_id'
// });
projectSchema.pre('save', function (next) {

	if (!this.projectId) {
		this.projectId = `P-${uid(6)}`;
		next();
	 }
})

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

