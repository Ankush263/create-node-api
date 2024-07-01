const { argv } = require('node:process');
const CommonFilesJS = require('./common/js/index');
const fs = require('node:fs/promises');
const MongoJsAPI = require('./helpers/mongo/js/index');
const path = require('node:path');

//* node index.js <filePath(. OR ./src)> <language(--js OR --ts OR -javascript OR -typescript)>
/*
! Options
*1 -> error handlers (-e)
*2 -> security (-s)
*3 -> auth (-a)
*/

//* node index.js . --js -e -s -a || node index.js ./output --js -esa

let filePath = '';
let language = '';
let errorHandle = false;
let security = false;
let auth = false;

filePath = argv[2];
language = argv[3];

const createFolder = async (path) => {
	try {
		await fs.mkdir(path, { recursive: true });
	} catch (error) {
		console.error('error: ', error);
	}
};

const createMongoJsApi = async (isError, isSecurity, isAuth) => {
	try {
		const serverFolderPath = path.join(__dirname, filePath, 'server');
		await createFolder(serverFolderPath);

		const mongoJsAPI = new MongoJsAPI(
			serverFolderPath,
			isError,
			isSecurity,
			isAuth
		);

		const commonJsFiles = new CommonFilesJS(
			serverFolderPath,
			isError,
			isSecurity,
			isAuth
		);

		mongoJsAPI.generatePackageFile();
		mongoJsAPI.generateNodemonFile();
		mongoJsAPI.generateEnvFile();

		const srcFolderPath = path.join(serverFolderPath, 'src');
		await createFolder(srcFolderPath);

		const controllerPath = path.join(serverFolderPath, 'src', 'controllers');
		await createFolder(controllerPath);

		const dbPath = path.join(serverFolderPath, 'src', 'db');
		await createFolder(dbPath);

		const middlewarePath = path.join(serverFolderPath, 'src', 'middlewares');
		await createFolder(middlewarePath);

		const modelsPath = path.join(serverFolderPath, 'src', 'models');
		await createFolder(modelsPath);

		const routesPath = path.join(serverFolderPath, 'src', 'routes');
		await createFolder(routesPath);

		const utilsPath = path.join(serverFolderPath, 'src', 'utils');
		await createFolder(utilsPath);

		mongoJsAPI.createAppFile();
		mongoJsAPI.createDBFile();
		if (isError) {
			commonJsFiles.generateAppError();
		}
		if (isAuth) {
			commonJsFiles.generateCatchAsync();
			mongoJsAPI.generateUserModel();
			mongoJsAPI.generateAuthControllers();
			mongoJsAPI.generateAuthRouter();
			mongoJsAPI.generateIndexRoutes();
		}
		mongoJsAPI.generateIndexFile();
	} catch (error) {
		console.error('error: ', error);
	}
};

if (!language || language === '--js' || language === '-javascript') {
	if (argv.indexOf('-e') !== -1 || argv[argv.length - 1].includes('e')) {
		errorHandle = true;
	}
	if (argv.indexOf('-s') !== -1 || argv[argv.length - 1].includes('s')) {
		security = true;
	}
	if (argv.indexOf('-a') !== -1 || argv[argv.length - 1].includes('a')) {
		auth = true;
	}

	createMongoJsApi(errorHandle, security, auth);
}
