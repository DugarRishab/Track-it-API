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
		trim: true,
		maxLength: [250, 'Description must not have more than 250 charachters'],
	},
	admin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'A project must have a admin']
	},
	active: {
		type: Boolean,
		default: true
	},
	projectId: {
		type: String,
	},
	users: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User'
	}
});


const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

