const { argv } = require('node:process');
const fs = require('node:fs/promises');
const path = require('node:path');
const MongoJsAPI = require('./helpers/mongo-js/index');

//* node index.js <filePath(. OR ./src)> <language(--js OR --ts OR -javascript OR -typescript)>

let filePath = '';
let language = '';

filePath = argv[2];
language = argv[3];

const createFolder = async (path) => {
	try {
		await fs.mkdir(path, { recursive: true });
	} catch (error) {
		console.error('error: ', error);
	}
};

const createMongoJsApi = async () => {
	try {
		const serverFolderPath = path.join(__dirname, filePath, 'server');
		await createFolder(serverFolderPath);

		const mongoJsAPI = new MongoJsAPI(serverFolderPath);

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
	createMongoJsApi();
}
