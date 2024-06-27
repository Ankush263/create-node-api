const { exec } = require('node:child_process');

class MongoJsAPI {
	constructor() {}

	generatePackageFile() {
		const packageCommand = `{
  "name": "mongo-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon",
    "prod": "NODE_ENV=production node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "body-parser": "^1.20.2",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^7.3.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.4.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.3"
  }
}`;

		exec(
			`
				cd server 
				echo '${packageCommand}' > package.json
			`,
			(error, stdout, stderr) => {
				if (error) {
					console.error(error);
					return;
				}
				console.log(stdout);
				console.error(stderr);
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
      cd server 
      echo '${nodemonCommand}' > nodemon.json
    `,
			(error, stdout, stderr) => {
				if (error) {
					console.error(error);
					return;
				}
				console.log(stdout);
				console.error(stderr);
			}
		);
	}
}

module.exports = MongoJsAPI;
