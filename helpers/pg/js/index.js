const { exec } = require('node:child_process');

class PgJsAPI {
	constructor(projectPath, isError, isSecurity, isAuth) {
		this.projectPath = projectPath;
		this.isError = isError;
		this.isSecurity = isSecurity;
		this.isAuth = isAuth;
	}

	generatePackageFile() {}

	generateEnvFile() {}

	createAppFile() {}
}

module.exports = PgJsAPI;
