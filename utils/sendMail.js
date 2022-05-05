const nodemailer = require('nodemailer');
const pug = require('pug');
const{ htmlToText } = require('html-to-text');

module.exports = class Email {
	constructor(user, url, data) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `RIshab Dugar <${process.env.EMAIL_FROM}>`
		this.data = data
	}

	newTransport() {
		// if (process.env.NODE_ENV === 'production') {
		// 	return 1;
		// }

		return nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD
			}
			// Activate in gmail "less secure app" option.
			// Gmail is not a good option for production apps.
		});
	}

	async send(template, subject) {
		// 1) Render HTML based on a pug template
		const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
			firstName: this.firstName,
			url: this.url,
			subject,
			data: this.data
		});
		const text = htmlToText(html)

		// 2) Define email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text
			//html: options.html
		}

		// 3) Create a transport and send email
		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to the LaTours Family');
	}
	
	async sendPasswordReset() {
		await this.send('passwordResetEmail', 'Your password reset token (Valid only for 10 mins)');
	}

	async sendOtpEmail() {
		console.log('sending otp email');
		await this.send('otpEmail', 'Your singup OTP');
	}
}
