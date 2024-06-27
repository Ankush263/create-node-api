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
		const folderCreation = await fs.mkdir(path, { recursive: true });
		console.log(`Directory created in ${folderCreation}`);
	} catch (error) {
		console.error(error);
	}
};

const createMongoJsApi = async () => {
	try {
		const serverFolder = path.join(__dirname, 'server');
		await createFolder(serverFolder);

		mongoJsAPI.generatePackageFile();
		mongoJsAPI.generateNodemonFile();
	} catch (error) {
		console.error(error);
	}
};

if (!language || language === '--js' || language === '-javascript') {
	createMongoJsApi();
}
