const fs = require('node:fs');
const path = require('node:path');

class MongoJsAPI {
	constructor(projectPath, isError, isSecurity, isAuth) {
		this.projectPath = projectPath;
		this.isError = isError;
		this.isSecurity = isSecurity;
		this.isAuth = isAuth;
	}

	generatePackageFile() {
		const packageName = '"name": "mongo-api",\n';
		const packageVersion = '"version": "1.0.0",\n';
		const mainFile = '"main": "index.js",\n';
		const scripts =
			'"scripts": {\n    "dev": "nodemon",\n    "prod": "NODE_ENV=production node index.js"\n  },\n';
		const keywords = '"keywords": [],\n';
		const author = '"author": "",\n';
		const license = '"license": "ISC",\n';
		const description = '"description": "generated by create-node-api",\n';

		const bcrypt = '"bcryptjs": "^5.1.1"';
		const bodyParser = '"body-parser": "^1.20.2"';
		const cookieParser = '"cookie-parser": "^1.4.6"';
		const cors = '"cors": "^2.8.5"';
		const dotenv = '"dotenv": "^16.4.5"';
		const express = '"express": "^4.19.2"';
		const expressMongoSanitize = '"express-mongo-sanitize": "^2.2.0"';
		const expressRateLimit = '"express-rate-limit": "^7.3.1"';
		const helmet = '"helmet": "^7.1.0"';
		const hpp = '"hpp": "^0.2.3"';
		const jsonWebToken = '"jsonwebtoken": "^9.0.2"';
		const mongoose = '"mongoose": "^8.4.1"';
		const validator = '"validator": "^13.12.0"';

		const devNodemon = '"nodemon": "^3.1.3"';

		const dependencies = `\n${
			this.isAuth ? `    ${bcrypt},\n` : ''
		}    ${bodyParser},\n${
			this.isAuth ? `    ${cookieParser},\n` : ''
		}    ${cors},\n    ${dotenv},\n    ${express},\n${
			this.isSecurity ? `    ${expressMongoSanitize},\n` : ''
		}${this.isSecurity ? `    ${expressRateLimit},\n` : ''}${
			this.isSecurity ? `    ${helmet},\n` : ''
		}${this.isSecurity ? `    ${hpp},\n` : ''}${
			this.isAuth ? `    ${jsonWebToken},\n` : ''
		}${this.isAuth ? `    ${validator},\n` : ''}    ${mongoose}`;

		const devDependencies = `\n    ${devNodemon}`;

		const topPackageDetails = `${packageName}  ${packageVersion}  ${mainFile}  ${scripts}  ${keywords}  ${author}  ${license}  ${description}`;

		const packageCommand = `{\n  ${topPackageDetails}  "dependencies": ${
			dependencies.length > 0 ? `{  ${dependencies}\n  }` : '{}'
		},\n  "devDependencies": ${
			devDependencies.length > 0 ? `{  ${devDependencies}\n  }` : '{}'
		}\n}`;

		const filePath = path.join(this.projectPath, 'package.json');

		fs.writeFile(filePath, packageCommand, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}

	generateEnvFile() {
		const mongoUri = 'MONGO_URI=';
		const jwtSecret = 'JWT_SECRET=';
		const jwtExpire = 'JWT_EXPIRES_IN=';
		const cookiesExpire = 'JWT_COOKIE_EXPIRES_IN=';
		const port = 'PORT=8000';
		const environment = 'NODE_ENV=development';

		const envVariables = `${mongoUri}\n${this.isAuth ? `${jwtSecret}\n` : ''}${
			this.isAuth ? `${jwtExpire}\n` : ''
		}${this.isAuth ? `${cookiesExpire}\n` : ''}${port}\n${environment}`;

		const filePath = path.join(this.projectPath, '.env.example');

		fs.writeFile(filePath, envVariables, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}

	createAppFile() {
		const requireAppError = "const AppError = require('./utils/AppError');\n";
		const requireBodyParser = "const bodyParser = require('body-parser');\n";
		const requireCookieParser =
			"const cookieParser = require('cookie-parser');\n";
		const requireCors = "const cors = require('cors');\n";
		const requireExpress = "const express = require('express');\n";
		const requireGlobalErrorHandler =
			"const globalErrorHandler = require('./middlewares/global-error');\n";
		const requireHelmet = "const helmet = require('helmet');\n";
		const requireHpp = "const hpp = require('hpp');\n";
		const requireExpressMongoSanitize =
			"const mongoSanitize = require('express-mongo-sanitize');\n";
		const requireRateLimit =
			"const rateLimit = require('express-rate-limit');\n";
		const requireRoute = "const routes = require('./routes/index');\n";

		const defineApp = 'const app = express();';

		const useCors = 'app.use(cors());\n';
		const useHelmet = 'app.use(helmet());\n';
		const useCookieParser = 'app.use(cookieParser());\n';
		const useBodyParser = 'app.use(bodyParser.json());\n';
		const useHpp = 'app.use(hpp());\n';
		const useGlobalErrorHandler = 'app.use(globalErrorHandler);\n';
		const useMongoSanitize = 'app.use(mongoSanitize());\n';
		const useRoutes = "app.use('/api/v1', routes);\n\n";

		const setLimiter =
			"const limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  limit: 100,\n  standardHeaders: 'draft-7',\n  legacyHeaders: false,\n})\n";

		const useRateLimit = 'app.use(limiter);\n\n';

		const handleWrongUrlError =
			"\napp.all('*', (req, res, next) => {\n  next(new AppError('Cant find ' + req.originalUrl + ' on this server!!', 404));\n});\n";

		const disableXPower = "app.disable('X-powered-by');\n\n";

		const exportApp = 'module.exports = app;\n';

		const allRequireStatements = `${
			this.isError ? requireAppError : ''
		}${requireBodyParser}${
			this.isAuth ? requireCookieParser : ''
		}${requireCors}${requireExpress}${
			this.isError ? requireGlobalErrorHandler : ''
		}${this.isSecurity ? requireHelmet : ''}${
			this.isSecurity ? requireHpp : ''
		}${this.isSecurity ? requireExpressMongoSanitize : ''}${
			this.isSecurity ? requireRateLimit : ''
		}${this.isAuth ? requireRoute : ''}`;

		const wrongUrlError = `${this.isError ? handleWrongUrlError : ''}`;

		const handleRateLimit = `${
			this.isSecurity ? `${setLimiter}\n${useRateLimit}` : ''
		}`;

		const handleDisableXPoweredBy = `${this.isSecurity ? disableXPower : ''}`;

		const handleUseRoutes = `${this.isAuth ? useRoutes : ''}`;

		const allUseStatemants = `${useCors}${this.isSecurity ? useHelmet : ''}${
			this.isAuth ? useCookieParser : ''
		}${useBodyParser}${this.isSecurity ? useHpp : ''}${
			this.isSecurity ? useMongoSanitize : ''
		}${this.isError ? useGlobalErrorHandler : ''}`;

		const appVariables =
			allRequireStatements +
			'\n' +
			defineApp +
			'\n' +
			wrongUrlError +
			'\n' +
			allUseStatemants +
			'\n' +
			handleRateLimit +
			handleDisableXPoweredBy +
			handleUseRoutes +
			exportApp;

		const filePath = path.join(this.projectPath, 'src', 'app.js');

		fs.writeFile(filePath, appVariables, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}

	createDBFile() {
		const dbVariables = `const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connection = async () => {
	try {
		const connectionInstance = await mongoose.connect(\`\${process.env.MONGO_URI}\`);

		console.log(
			\`\\nMongoDB is connected to \${connectionInstance.connection.name} with the DB HOST: \${connectionInstance.connection.host}\`
		);
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = connection;
`;

		const filePath = path.join(this.projectPath, 'src', 'db', 'index.js');

		fs.writeFile(filePath, dbVariables, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}

	generateIndexFile() {
		const indexVariable = `const app = require('./src/app');
const connection = require('./src/db/index');
const dotenv = require('dotenv');
const http = require('http');

dotenv.config();

const server = http.createServer(app);

process.env.TZ = 'Asia/Calcutta';

connection()
	.then(() => {
		server.listen(process.env.PORT || 8000, () => {
			console.log('Server is running at port: ' + process.env.PORT);
		});
	})
	.catch((error) => {
		throw new Error(error);
	});
	`;

		const filePath = path.join(this.projectPath, 'index.js');

		fs.writeFile(filePath, indexVariable, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}

	generateUserModel() {
		const userModelVariable = `const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
		},
		email: {
			type: String,
			required: [true, 'User must have an email'],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, 'please provide a valid email'],
		},
		password: {
			type: String,
			required: [true, 'please provide a password'],
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
`;

		const filePath = path.join(
			this.projectPath,
			'src',
			'models',
			'user.model.js'
		);

		fs.writeFile(filePath, userModelVariable, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}

	generateAuthControllers() {
		const authControllersVariables = `const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

require('dotenv').config();

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createAndSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);

	res.json({ token });
};

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new AppError('Please provide email & password', 404));
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user || !bcrypt.compareSync(password, user.password)) {
		return next(new AppError('Incorrect email or password', 401));
	}

	createAndSendToken(user, 200, res);
});

const signup = catchAsync(async (req, res, next) => {
	const { username, email, password } = req.body;

	const existUser = await User.find({ username });

	if (existUser.length > 0) {
		return next(new AppError('user with this username is already exists', 404));
	}

	if (!email || !password) {
		return next(new AppError('Please provide email and password', 400));
	}

	const hashedPassword = bcrypt.hashSync(password, 12);

	const newUser = await User.create({
		username,
		email,
		password: hashedPassword,
	});
	createAndSendToken(newUser, 201, res);
});

const protect = catchAsync(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	if (!token) {
		return next(
			new AppError('You are not logged in! Please log in to get access', 401)
		);
	}

	const decoded = jwt.decode(token);

	let freshUser;

	freshUser = await User.findById(decoded.id);

	if (!freshUser) {
		return next(
			new AppError('The user belonging to this token does no longer exist', 401)
		);
	}

	req.user = freshUser;

	next();
});

module.exports = { signup, login, protect };
`;

		const filePath = path.join(
			this.projectPath,
			'src',
			'controllers',
			'authControllers.js'
		);

		fs.writeFile(filePath, authControllersVariables, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}

	generateAuthRouter() {
		const authRouteVariable = `const express = require('express');
const { signup, login } = require('../controllers/authControllers');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

module.exports = router;
`;

		const filePath = path.join(
			this.projectPath,
			'src',
			'routes',
			'auth.routes.js'
		);

		fs.writeFile(filePath, authRouteVariable, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}

	generateIndexRoutes() {
		const indexRouteVariable = `const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));

module.exports = router;
`;

		const filePath = path.join(this.projectPath, 'src', 'routes', 'index.js');

		fs.writeFile(filePath, indexRouteVariable, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}

	generateGlobalErrorFile() {
		const globalErrorVariable = `const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
	const message = 'Invalid ' + err.path + ': ' + err.value;
	return new AppError(message, 401);
};

const handleDuplicateFieldsDB = (err) => {
	const value = Object.keys(err.keyValue)[0];
	const message =
		'Duplicate field value ' + value + ', Please use another value.';
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);

	const message = 'Invalid input data. ' + errors.join('. ');
	return new AppError(message, 400);
};

const handleJWTError = (err) =>
	new AppError('Invalid token, Please log in again', 401);

const handleJWTExpiredError = (err) =>
	new AppError('Your token has expired!, Please log in again', 401);

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		console.error('ERROR', err);
		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	res.set('Access-Control-Allow-Origin', '*');

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = err;
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === 'ValidationError')
			error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
		if (error.name === 'TokenExpiredError')
			error = handleJWTExpiredError(error);
		sendErrorProd(error, res);
	}
};
`;

		const filePath = path.join(
			this.projectPath,
			'src',
			'middlewares',
			'global-error.js'
		);

		fs.writeFile(filePath, globalErrorVariable, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}
}

module.exports = MongoJsAPI;
