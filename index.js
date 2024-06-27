const { argv } = require('node:process');
const fs = require('node:fs/promises');
const path = require('node:path');
const MongoJsAPI = require('./helpers/mongo-js/index');

//* node index.js <filePath(. OR ./src)> <language(--js OR --ts OR -javascript OR -typescript)>

let filePath = '';
let language = '';

filePath = argv[2];
language = argv[3];

const mongoJsAPI = new MongoJsAPI();

const createFolder = async (path) => {
	try {
		await fs.mkdir(path, { recursive: true });
	} catch (error) {
		console.error('error: ', error);
	}
};

const createMongoJsApi = async () => {
	try {
		const serverFolderPath = path.join(__dirname, 'server');
		await createFolder(serverFolderPath);

		mongoJsAPI.generatePackageFile();
		mongoJsAPI.generateNodemonFile();
		mongoJsAPI.generateEnvFile();

		const srcFolderPath = path.join(__dirname, 'server', 'src');
		await createFolder(srcFolderPath);

		const controllerPath = path.join(__dirname, 'server', 'src', 'controllers');
		await createFolder(controllerPath);

		const dbPath = path.join(__dirname, 'server', 'src', 'db');
		await createFolder(dbPath);

		const middlewarePath = path.join(__dirname, 'server', 'src', 'middlewares');
		await createFolder(middlewarePath);

		const modelsPath = path.join(__dirname, 'server', 'src', 'models');
		await createFolder(modelsPath);

		const routesPath = path.join(__dirname, 'server', 'src', 'routes');
		await createFolder(routesPath);

		const utilsPath = path.join(__dirname, 'server', 'src', 'utils');
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
