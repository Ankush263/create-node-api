const { exec } = require('node:child_process');

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

module.exports = AppError;`;

		exec(
			`
			mkdir -p ${this.projectPath}/src/utils &&
	    echo '${appErrorVariable}' > ${this.projectPath}/src/utils/appError.js
    `,
			(error, stdout, stderr) => {
				if (error) {
					console.error(error);
					return;
				}
				if (stderr) {
					console.error(stderr);
					return;
				}
			}
		);
	}

	generateCatchAsync() {
		const appErrorVariable = `const catchAsync = (asyncFunction) => {
	return (req, res, next) => {
		asyncFunction(req, res, next).catch((err) => {
			next(err);
		});
	};
};

module.exports = catchAsync;`;

		exec(
			`
			mkdir -p ${this.projectPath}/src/utils &&
			echo '${appErrorVariable}' > ${this.projectPath}/src/utils/catchAsync.js
		`,
			(error, stdout, stderr) => {
				if (error) {
					console.error(error);
					return;
				}
				if (stderr) {
					console.error(stderr);
					return;
				}
			}
		);
	}

	generateNodemonFile() {
		const nodemonCommand = `{
	"watch": ["src"],
	"ext": ".js",
	"exec": "node index.js"
}`;

		exec(
			`
      cd ${this.projectPath} 
      echo '${nodemonCommand}' > nodemon.json
    `,
			(error, stdout, stderr) => {
				if (error) {
					console.error(error);
					return;
				}
				if (stderr) {
					console.error(stderr);
					return;
				}
			}
		);
	}
}

module.exports = CommonFilesJS;
