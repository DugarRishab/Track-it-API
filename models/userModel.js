const mongoose = require('mongoose');
//const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'User must have a name. Please provide name'],
		trim: true,
		minLength: [4, 'Name must have atleat - 4 characters']
	},
	email: {
		type: String,
		required: [true, 'Every User must have a unique Email. Please provide Email'],
		unique: [true, 'Email already in use'],
		validate: [validator.isEmail, 'Invalid Email'],
		lowercase: true
	},
	password: {
		type: String,
		required: [true, 'Every user must have a password'],
		select: false
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please enter passwordConfirm'],
		validate: {
			validator: function (val) {
				return val === this.password;
			},
			message: 'Passwords does not match'
		}
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	otp: String,
	otpExpiresBy: Date,
	emailVerified: {
		type: Boolean,
		//default: false
	},
	active: {
		type: Boolean,
		default: true,
		select: false
	},
	adminStatus: {
		type: String,
		default: 'user',
		enum: ['user', 'admin']
	},
	image: {
		type: String,
		default: 'default.jpg'
	},
	userId: {
		type: String,
	},
	joinedAt: {
		type: Date,
		default: Date.now()
	},
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});
// MONGOOSE MIDDLEWARES ->>

// Password encryption ->
userSchema.pre('save', async function (next){	
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;
	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.pre(/^find/, async function (next) { 
	this.find({ active: { $ne: false } });
	next();
});

// userSchema functions ->>

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

		//console.log(changedTimestamp, JWTTimestamp);
		return JWTTimestamp < changedTimestamp;
	}

	return false; // false means NOT changed.
};
userSchema.methods.createPasswordResetToken = function () {

	const resetToken = crypto.randomBytes(32).toString('hex'); // <- Crypto is pre-installed encryption library

	this.passwordResetToken = crypto  // <- Crypto is not as strong as bcrypt, 
		.createHash('sha256')		  //    but in this case we don't need such strong encryption.
		.update(resetToken)
		.digest('hex');

	//console.log({ resetToken }, this.passwordResetToken);
	
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;