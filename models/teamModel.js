const mongoose = require('mongoose');
//const slugify = require('slugify');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');

const teamSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Every team must have a name'],
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	admin: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, 'Every team must have a admin'],
		ref: 'User'
	},
	dateCreated: {
		type: Date,
		default: Date.now()
	},
	members: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User'
	},
	image: {
		type: String,
		default: 'teamDefault.png'
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	},
	teamId: String
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;