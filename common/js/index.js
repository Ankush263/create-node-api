const fs = require('node:fs');
const path = require('node:path');

class CommonFilesJS {
	constructor(projectPath, isError, isSecurity, isAuth) {
		this.projectPath = projectPath;
		this.isError = isError;
		this.isSecurity = isSecurity;
		this.isAuth = isAuth;
	}

	generateAppError() {
		const appErrorVariable = `class AppError extends Error {
	constructor(message, statusCode) {
		super(message);

		this.statusCode = statusCode;
		this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;
`;

		const filePath = path.join(this.projectPath, 'src', 'utils', 'appError.js');

		fs.writeFileSync(filePath, appErrorVariable, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}

	generateCatchAsync() {
		const catchAsyncVariables = `const catchAsync = (asyncFunction) => {
	return (req, res, next) => {
		asyncFunction(req, res, next).catch((err) => {
			next(err);
		});
	};
};

module.exports = catchAsync;
`;

		const filePath = path.join(
			this.projectPath,
			'src',
			'utils',
			'catchAsync.js'
		);

		fs.writeFileSync(filePath, catchAsyncVariables, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}

	generateNodemonFile() {
		const nodemonCommand = `{
	"watch": ["src"],
	"ext": ".js",
	"exec": "node index.js"
}`;

		const filePath = path.join(this.projectPath, 'nodemon.json');

		fs.writeFileSync(filePath, nodemonCommand, (error) => {
			if (error) {
				console.error(`Error writing file: ${error}`);
				return;
			}
		});
	}
}

module.exports = CommonFilesJS;
