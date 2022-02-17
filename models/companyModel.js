const mongoose = require('mongoose');
//const slugify = require('slugify');

const companySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a Company Name as "name"']
	},
	companyId: {
		type: String,
	},
	country: String,
	administrator: {
		type: mongoose.Schema.Types.ObjectID,
		ref: 'User',
		required:[true, 'Please provide a Administrator']
	}
	
},{
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

companySchema.pre(/^find/, function (next) {	
	
	this.populate({	// <- this will fill the reviews with user documents
		path: 'administrator',
		select: 'name photo role'
	});
	
	next();
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;