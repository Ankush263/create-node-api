const { stdin, stdout, argv } = require('node:process');
const { spawn, exec } = require('node:child_process');
const fs = require('node:fs');
const { mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');

//* node index.js <filePath(. OR ./src)> <language(--js OR --ts OR -javascript OR -typescript)>

let filePath = '';
let language = '';

filePath = argv[2];
language = argv[3];

const createFolder = async (path) => {
	try {
		const folderCreation = await mkdir(path, { recursive: true });
		console.log(`Directory created in ${folderCreation}`);
	} catch (error) {
		console.error(error);
	}
};

const createMongoJsApi = async () => {
	try {
		const serverFolder = path.join(__dirname, 'server');
		await createFolder(serverFolder);

		// exec('touch package.json');
		const content = 'this is a demo content';
		await writeFile(`${serverFolder}/package.json`, content);

		// const packageFileReadStream = fs.createReadStream(
		// 	'./api/mongo-api-js/package.json'
		// );
		// const packageFileWriteStream = fs.createWriteStream(
		// 	'./server/package.json'
		// );
		// packageFileReadStream.pipe(packageFileWriteStream);
	} catch (error) {
		console.error(error);
	}
};

if (!language || language === '--js' || language === '-javascript') {
	createMongoJsApi();
}
