const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Company = require('./../models/companyModel');
const User = require('./../models/userModel');
const uid = require('./../utils/generateUID');

exports.getAllCompanies = catchAsync(async (req, res, next) => {
	const companies = await Company.find();

	res.status(200).json({
		message: 'success',
		data: {
			companies
		}
	});
});

exports.createCompany = catchAsync(async (req, res, next) => {

	const companyId = `C-${uid(6)}`;
	const userId = `U-${uid(8)}`;

	// const task=`TSK-${uid(12)}`
	// const team=`T-${uid(8)}`
	// const project=`P-${uid(6)}`

	const user = await User.create({
		name: req.body.administratorName,
		email: req.body.administratorEmail,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		adminStatus: 'administrator',
		companyId,
		userId,
		role: req.body.administratorRole
	});

	const company = await Company.create({
		name: req.body.name,
		country: req.body.country,
		companyId,
		administrator: user._id
	});

	res.status(201).json({
		message: 'success',
		data: {
			company,
			administrator: user
		}
	});
});