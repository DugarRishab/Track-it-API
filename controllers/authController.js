/* eslint-disable new-cap */
/* eslint-disable no-lone-blocks */
/* eslint-disable arrow-body-style */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = require('./../models/userModel');
// const Company = require('./../models/companyModel');
//const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
// const Email = require('./../utils/sendMail');
const log = require('./../utils/colorCli');
const uid = require('./../utils/generateUID');


const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMEOUT });
}
const createSendToken = (user, statusCode, res) => {
	const token = signToken(user.id);

	const cookieOptions = {
		expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN),
		httpOnly: true,
		path: '/',
		sameSite: 'none',
	};
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	user.password = undefined;

	res.cookie('jwt', token, cookieOptions);

	console.log(res);

	res.status(statusCode).json({
		message: 'success',
		token,
		data: {
			user
		}
	});
}

// exports.createSendOtp = catchAsync(async (req, res, next) => {
	
// 	const otp = uid(20);
// 	//return result;
// 	const otpExpiresIn = moment.duration(process.env.OTP_EXPIRES_IN);
// 	const otpExpiresBy = moment(Date.now());
// 	otpExpiresBy.add(otpExpiresIn);
// 	console.log('otp duration: ', otpExpiresIn);
// 	console.log(otpExpiresBy, "current date", moment(Date.now()));

// 	const newUser = req.user;

// 	newUser.otp = otp;
// 	newUser.otpExpiresBy = otpExpiresBy;

// 	console.log("newUser: ", newUser);

// 	const user = await User.findByIdAndUpdate(newUser.id, newUser, {
// 		new: true,
// 		runValidators: true
// 	});

// 	console.log("user after updation: ", user);

// 	const url = `${req.protocol}://${req.get('host')}/verifyEmail/${user.id}-${otp}`;
// 	//console.log(url);

// 	//const user = await User.find({ email: newUser.email });

// 	// if (!user) {
// 	// 	console.log('user not found after otp')
// 	// }

// 	//console.log('user.found: ', newUser.otp);
// 	//console.log('email function starting...');
// 	await new Email(user, url, {}).sendOtpEmail();
// 	//console.log('email function completed');

// 	next(new AppError('EMAIL NOT VERIFIED: An URL has been sent to your email. Click on the URL to verify your email', 401));
// });

// exports.verifyOtp = catchAsync(async (req, res, next) => {
// 	//console.log('req:', req.body);
// 	//const newUser = req.body.user;
// 	const [id, otp] = req.params.code.split('-');

// 	const user = await User.findById(id);

// 	if (!user || !otp) {
// 		return next(new AppError('URL not valid', 400));
// 	}
// 	if (user.otp !== otp) {
		
// 		return next(new AppError('URL not Valid', 400));
// 	}
// 	//const totalDiff = moment.duration(endDate.diff(startDate)).as('hours');
// 	const otpExpirationTime = new moment(user.otpExpiresBy);
// 	const currentTime = new moment(Date.now());
// 	const timeDiff = moment.duration(otpExpirationTime.diff(currentTime)).as('ms');

// 	console.log('otpExpirationTime: ', otpExpirationTime);
// 	console.log('currentTime: ', currentTime);
// 	console.log('timeDiff: ', timeDiff);
	
// 	if (timeDiff < 0) {
// 		return next(new AppError('OTP expired', 400));
// 	}
// 	user.emailVerified = true;
// 	user.otp = undefined;
// 	user.otpExpiresBy = undefined;

// 	//await new Email(user).sendWelcome();

// 	await User.findByIdAndUpdate(id, user, {
// 		new: true
// 	});

// 	// res.status(201).json({
// 	// 	status: 'success',
// 	// 	message: 'You have been verified :) \n Go back and Login'
// 	// });
// 	createSendToken(user, 201, res);
// });

exports.signup = catchAsync(async (req, res, next) => {
	
	const userId = `#U-${uid(8)}`;
	
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		status: req.body.status,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		adminStatus: req.body.adminStatus || 'user',
		userId,
		image: 'default.jpg',
		// otp: ' ',
		// otpExpiresBy: Date.now(),
		// emailVerified: false
	});

	//createSendOtp(newUser, req, res, next);
	createSendToken(newUser, 201, res);

	req.user = newUser;
	
});
exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new AppError('Please provide email and password', 401));
	}

	const user = await User.findOne({ email }).select('+password +active');

	if (!user || (!await user.correctPassword(password, user.password)) || !user.active) {
		return next(new AppError('Incorrect email or password', 401));
	}
	//console.log(req.headers);

	createSendToken(user, 200, res);
	req.user = user;

});
exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}
	else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		return next(new AppError('you are not logged in', 401))
	}

	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	const currentUser = await User.findById(decoded.id);

	if (!currentUser) {
		return next(new AppError('The user no longer exists', 401));
	}
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError('Recently changed Password! Please login Again', 401));
	}

	console.log(log.success('!!! GRANTING ACCESS !!!'));

	res.locals.user = currentUser;
	req.user = currentUser;

	next();
});
exports.logout = (req, res, next) => {

	const cookieOptions = {
		expires: new Date(Date.now() + 2*1000),
		httpOnly: true
	}
	
	// Sending new cookie with rubbish text to replace the new cookie ->
	res.cookie('jwt', 'loggedout', cookieOptions);
	
	res.status(200).json({
		message: 'success'
	});
}
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.adminStatus)) {
			console.log(log.debug(roles));
			console.log(log.debug(req.user.adminStatus));
			return next(new AppError('You do not have permision to perform this action', 401));
		}
		next();
	}
}
exports.checkCompany = () => {
	
}
exports.isLoggedIn = async (req, res, next) => {	// <- We do not want to cause a Global error, so no catchAsync
	
	// 1) Getting token and checking if it's there ->
	if (req.cookies.jwt) {
		try {
			
			const token = req.cookies.jwt;
			const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
		
			const currentUser = await User.findById(decoded.id).populate({
				path: 'projects teams'
			});
			//console.log(currentUser.name);
			if (!currentUser) {
				return next();
			}

			if (currentUser.changedPasswordAfter(decoded.iat)) {
				return next();
			}
		
			// There is as logged in user
			res.locals.user = currentUser;
			return next();
		}
		catch (err) {
			console.log(err)
			return next();
		}
	}
	next();
	
};