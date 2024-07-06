#!/usr/bin/env node

const { argv } = require('node:process');
const CommonFilesJS = require('./common/js/index');
const fs = require('node:fs/promises');
const MongoJsAPI = require('./helpers/mongo/js/index');
const path = require('node:path');
const PgJsAPI = require('./helpers/pg/js/index');

//* node index.js <filePath(. OR ./src)> <-mongo/-pg> <language(--js OR --ts OR -javascript OR -typescript)>
/*
! Options
*1 -> error handlers (-e)
*2 -> security (-s)
*3 -> auth (-a)
*/

//* npx create-n-e-app my-app -pg --js -esa || npx create-n-e-app server -mongo --js -esa

let language = '';
let apiName = '';
let errorHandle = false;
let security = false;
let auth = false;

apiName = argv[2];
language = argv[4];

const apiType = argv[3];

const createFolder = async (path) => {
	try {
		await fs.mkdir(path, { recursive: true });
	} catch (error) {
		console.error('error: ', error);
	}
};

const createCommonFolders = async (folderPath) => {
	try {
		const srcFolderPath = path.join(folderPath, 'src');
		await createFolder(srcFolderPath);

		const controllerPath = path.join(folderPath, 'src', 'controllers');
		await createFolder(controllerPath);

		const middlewarePath = path.join(folderPath, 'src', 'middlewares');
		await createFolder(middlewarePath);

		const routesPath = path.join(folderPath, 'src', 'routes');
		await createFolder(routesPath);

		const utilsPath = path.join(folderPath, 'src', 'utils');
		await createFolder(utilsPath);
	} catch (error) {
		console.log(error);
	}
};

const createMongoJsApi = async (isError, isSecurity, isAuth) => {
	try {
		const currentDirectory = process.cwd();
		const serverFolderPath = path.join(currentDirectory, apiName);
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
		commonJsFiles.generateNodemonFile();
		mongoJsAPI.generateEnvFile();

		await createCommonFolders(serverFolderPath);

		const dbPath = path.join(serverFolderPath, 'src', 'db');
		await createFolder(dbPath);

		const modelsPath = path.join(serverFolderPath, 'src', 'models');
		await createFolder(modelsPath);

		mongoJsAPI.createAppFile();
		mongoJsAPI.createDBFile();
		if (isError) {
			commonJsFiles.generateAppError();
			mongoJsAPI.generateGlobalErrorFile();
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

const createPgJsApi = async (isError, isSecurity, isAuth) => {
	try {
		const currentDirectory = process.cwd();
		const serverFolderPath = path.join(currentDirectory, apiName);
		await createFolder(serverFolderPath);

		const pgJsAPI = new PgJsAPI(serverFolderPath, isError, isSecurity, isAuth);

		const commonJsFiles = new CommonFilesJS(
			serverFolderPath,
			isError,
			isSecurity,
			isAuth
		);

		pgJsAPI.generatePackageFile();
		commonJsFiles.generateNodemonFile();
		pgJsAPI.generateEnvFile();

		await createCommonFolders(serverFolderPath);

		const migrationPath = path.join(serverFolderPath, 'migration');
		await createFolder(migrationPath);

		const migrationDataPath = path.join(serverFolderPath, 'migration', 'data');
		await createFolder(migrationDataPath);

		const repoPath = path.join(serverFolderPath, 'src', 'repo');
		await createFolder(repoPath);

		const repoUtilPath = path.join(serverFolderPath, 'src', 'repo', 'utils');
		await createFolder(repoUtilPath);

		pgJsAPI.createAppFile();
		pgJsAPI.createPoolFile();
		pgJsAPI.createDataPoolFile();
		pgJsAPI.createToCamelCaseFile();

		if (isError) {
			commonJsFiles.generateAppError();
			pgJsAPI.generateGlobalErrorFile();
		}

		if (isAuth) {
			commonJsFiles.generateCatchAsync();
		}
		pgJsAPI.generateIndexFile();
	} catch (error) {
		console.log(error);
	}
};

const setStateOfAPI = () => {
	if (argv.indexOf('-e') !== -1 || argv[argv.length - 1].includes('e')) {
		errorHandle = true;
	}
	if (argv.indexOf('-s') !== -1 || argv[argv.length - 1].includes('s')) {
		security = true;
	}
	if (argv.indexOf('-a') !== -1 || argv[argv.length - 1].includes('a')) {
		auth = true;
	}
};

if (
	apiType === '-mongo' &&
	(!language || language === '--js' || language === '-javascript')
) {
	setStateOfAPI();

	createMongoJsApi(errorHandle, security, auth);
}

if (
	apiType === '-pg' &&
	(!language || language === '--js' || language === '-javascript')
) {
	setStateOfAPI();

	createPgJsApi(errorHandle, security, auth);
}
