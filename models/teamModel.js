const mongoose = require('mongoose');
//const slugify = require('slugify');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');

const teamSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Every team must have a name']
	},
	description: String,
	leader: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, 'every team must have a leader'],
		ref: 'User'
	},
	createdOn: {
		type: Date,
		default: Date.now()
	},
	members: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'User'
	},
	projectId: {
		type: String,
	},
	companyId: {
		type: String,
		required: [true, 'every team must belong to a company']
	},
	image: {
		type: String,
		default: 'teamDefault.png'
	},
	teamId: String
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;