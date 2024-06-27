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
      cd server 
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

	generateEnvFile() {
		const envVariables = `MONGO_URI=
JWT_SECRET=SomeVariable
JWT_COOKIE_EXPIRES_IN=90
JWT_EXPIRES_IN=82d
PORT=8000
NODE_ENV=development

    `;

		exec(
			`
      cd server 
      echo '${envVariables}' > .env.example
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

	createAppFile() {
		const appVariables = `const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const globalErrorHandler = require('./middlewares/global-error');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.all('*', (req, res, next) => {
	next(new AppError('Cant find ' + req.originalUrl + ' on this server!!', 404));
});

app.use(globalErrorHandler);

module.exports = app;`;

		exec(
			`
      cd server
      cd src
      echo "${appVariables}" > app.js
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

module.exports = connection;`;

		const escapedDbVariables = dbVariables.replace(/'/g, "'\\''");

		exec(
			`
	mkdir -p server/src/db &&
	echo '${escapedDbVariables}' > server/src/db/index.js
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
	});`;

		exec(
			`
      cd server
      echo "${indexVariable}" > index.js
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

module.exports = MongoJsAPI;
