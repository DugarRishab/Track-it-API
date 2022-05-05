class AppError extends Error{
	constructor(message, statusCode) {
		super(message);
		
		//this.message = message;
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
		this.isOperational = true;
		//console.log()
		//this.setHeader("Content-Type", "application/json");
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;