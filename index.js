const { argv } = require('node:process');
const fs = require('node:fs/promises');
const path = require('node:path');
const MongoJsAPI = require('./helpers/mongo-js/index');

//* node index.js <filePath(. OR ./src)> <language(--js OR --ts OR -javascript OR -typescript)>
/*
! Options
*1 -> error handlers (-e=true/false)
*2 -> security (-s=true/false)
*3 -> auth (-a=true/false)
*/

//* node index.js . --js -e=true -s=true -a=true

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
		mongoJsAPI.generateIndexFile();
	} catch (error) {
		console.error('error: ', error);
	}
};

if (!language || language === '--js' || language === '-javascript') {
	if (argv[4] === '-e=true' || argv[5] === '-e=true' || argv[6] === '-e=true') {
		errorHandle = true;
	}
	if (argv[4] === '-s=true' || argv[5] === '-s=true' || argv[6] === '-s=true') {
		security = true;
	}
	if (argv[4] === '-a=true' || argv[5] === '-a=true' || argv[6] === '-a=true') {
		auth = true;
	}

	createMongoJsApi(errorHandle, security, auth);
}
