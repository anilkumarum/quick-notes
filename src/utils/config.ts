import { join } from "node:path";
import { workspace } from "vscode";
import { createDirIfNotExist } from "./create-note.js";

const configMap = workspace.getConfiguration("quicknotes.config");

type UserConfig = {
	notesLocation: string;
	defaultNotes: string;
	showFolderLocation: boolean;
};

export const userConfig: UserConfig = {
	notesLocation: configMap.get("notesLocation"),
	defaultNotes: configMap.get("defaultNotes"),
	showFolderLocation: configMap.get("showFolderLocation"),
};

function setNoteLocation() {
	const notePath = join(process.env.HOME, "quick-notes");
	configMap.update("notesLocation", notePath);

	createDirIfNotExist(notePath);
}

userConfig.notesLocation || setNoteLocation();
console.log(userConfig.notesLocation);
