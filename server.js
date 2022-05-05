const dotenv = require('dotenv');
const mongoose = require('mongoose');
const log = require('./utils/colorCli');

dotenv.config({ path: './config.env' });

const app = require('./app');

// Connecting to DATABASE ->>
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {// <- Using Mongoose Connection
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true 
}).then(() => {
	console.log('DB connection established');
});

// Starting Server ->>
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App running at port`,  log.extra(`${port}`), '...');
});