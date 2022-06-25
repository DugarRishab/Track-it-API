const dotenv = require('dotenv');
const mongoose = require('mongoose');
const log = require('./utils/colorCli');

dotenv.config({ path: './config.env' });

const app = require('./app');

// Connecting to DATABASE ->>
const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);


mongoose
	.connect(DB, {
		// <- Using Mongoose Connection
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('DB connection established');
	})
	.catch((err) => {
		console.log('DB CONNECTION FAILED');
		console.log('ERR: ', err);
	});

process.on('unCaughtException', (err) => {
	console.log(`UNCAUGHT EXCEPTION -> ${err.name} - ${err.message}`);
	console.log('App SHUTTING DOWN...');
	process.exit(1); // <- Then will shut down the server.
});

// Starting Server ->>
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
	console.log(`App running at port`, log.extra(`${port}`), '...');
});


// Catching unHandleled Rejections ->
process.on('unhandledRejection', (err) => {
	console.log(`UNHANDELLED REJECTION -> ${err.name} - ${err.message}`);
	console.log(err);
	console.log('App SHUTTING DOWN...');
	server.close(() => {
		// <- This will first terminate all requests
		process.exit(1); // <- Then will shut down the server.
	});
});

