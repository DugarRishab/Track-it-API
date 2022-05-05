const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
 
const userRouter = require('./routes/userRoutes');
const companyRouter = require('./routes/companyRoutes');
const projectRouter = require('./routes/projectRoutes');
const teamRouter = require('./routes/teamRoutes');
const taskRouter = require('./routes/taskRoutes');
const log = require('./utils/colorCli');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const app = express();

// MIDLEWARES ->>
app.enable('trust proxy');

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.use(cors());
app.options('http://localhost:3000', cors());

console.log(log.extra(`ENV = ${process.env.NODE_ENV}`));
app.use(morgan('dev')); // <- 3rd party Middleware Function
	
const limiter = rateLimit({
	max: 500, // max number of times per windowMS
	windowMs: 60 * 60 * 1000,
	message:
        '!!! Too many requests from this IP, Please try again in 1 hour !!!',
});

app.use("/api/v2", limiter);

app.use((req, res, next) => {	// <- Serves req time and cookies
	req.requestTime = new Date().toISOString();
	console.log(req.requestTime);
	if (req.cookies) console.log(req.cookies);
	next();
});

app.locals.moment = require('moment');	// 3rd party library to format date in pug

// app.set('view engine', 'pug');
// app.set('views', path.join( __dirname, 'views'));		  

app.use(express.static(path.join(__dirname, 'public'))); 

app.use((req, res, next) => {
	res.setHeader("Content-Type", "application/json");
	next();
});

app.use(express.json({ limit: '10kb' })); // <- Parses Json data
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // <- Parses URLencoded data
app.use(cookieParser()); // <- parses cookie data

app.use(mongoSanitize()); // <- Data Sanitization aganist NoSQL query Injection.
app.use(xss());   		  // <- Data Sanitization against xss

app.use(compression());

app.use('/api/v2/users', userRouter);
app.use('/api/v2/projects', projectRouter);
app.use('/api/v2/teams', teamRouter);
app.use('/api/v2/tasks', taskRouter);

app.all('*', (req, res, next) => {     // <- Middleware to handle Non-existing Routes
	next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(errorController); // <- Error Handling Middleware

module.exports = app;