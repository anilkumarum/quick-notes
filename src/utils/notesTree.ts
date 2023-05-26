import { readdir } from "node:fs/promises";

class FilePath {
	id;
	files;

	constructor(private name: string, private path: string, private isDirectory: boolean) {
		this.id = name;
		this.name = name;
		this.isDirectory = isDirectory;
		this.path = path;
		isDirectory && (this.files = []);
	}
}

export async function createDirTree(cwd: string) {
	const dirTree = { root: [] };

	let promises = [];
	async function walkDir(dirPath, openDir) {
		const dirents = await readdir(cwd + dirPath, { withFileTypes: true });

		for (const dirent of dirents) {
			const direntPath = `${dirPath}/${dirent.name}`;
			if (dirent.isDirectory()) {
				const folderPath = new FilePath(dirent.name, direntPath, true);
				openDir.push(folderPath);
				promises.push(walkDir(direntPath, folderPath.files));
			} else {
				openDir.push(new FilePath(dirent.name, direntPath, false));
			}
		}
	}
	promises.push(walkDir("", dirTree.root));
	await Promise.all(promises).catch((err) => console.error(err));
	await new Promise((r) => setTimeout(r, 100)); //fix later
	return dirTree;
}
