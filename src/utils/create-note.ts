import { join } from "node:path";
import { userConfig } from "./config.js";
import { access, constants, mkdir, rename, writeFile } from "node:fs/promises";
import statusBar from "./status-bar.js";

export async function getDailyNotePath() {
	const dailyFolder = join(userConfig.notesLocation, "daily-notes");
	await createDirIfNotExist(dailyFolder);

	const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });
	const monthFileName = monthName.replace(" ", "-");
	const monthFilePath = join(dailyFolder, monthFileName + ".md");
	const todayDate = new Date().toLocaleDateString("default", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
	try {
		await access(monthFilePath, constants.R_OK | constants.W_OK);
		//TODO add today date in exist file
		return monthFilePath;
	} catch (error) {
		await writeFile(monthFilePath, "# " + todayDate);
		return monthFilePath;
	}
}

export async function createDirIfNotExist(dirPath: string) {
	try {
		await access(dirPath, constants.R_OK | constants.W_OK);
		return true;
	} catch (error) {
		await mkdir(dirPath).catch((err) => console.error(err));
		return true;
	}
}

export async function getNewNotePath() {
	const noteFolder = userConfig.notesLocation;
	const newFilePath = join(noteFolder, new Date().toISOString().slice(0, -8) + ".md");
	await writeFile(newFilePath, "# first line is file name").catch((err) => console.error(err));
	statusBar.setToolTip();
	return newFilePath;
}

export async function renameFile(oldName, newName) {
	//TODO rename file
	await rename(oldName, newName).catch((err) => console.error(err));
}
