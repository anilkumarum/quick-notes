import { join } from "node:path";
import { window, workspace } from "vscode";
import { createDirIfNotExist } from "./create-note.js";
import statusBar from "./status-bar.js";

const configMap = workspace.getConfiguration("quicknotes.config");

type UserConfig = {
	notesLocation: string;
	defaultNotes: string;
	showFolderLocation: boolean;
	notesFolderList: Array<string>;
};

export const userConfig: UserConfig = {
	notesLocation: configMap.get("notesLocation"),
	defaultNotes: configMap.get("defaultNotes"),
	showFolderLocation: configMap.get("showFolderLocation"),
	notesFolderList: configMap.get("notesFolderList"),
};

(async function () {
	if (userConfig.notesLocation) return;
	userConfig.notesFolderList ??= [];

	if (userConfig.notesFolderList.length === 0) {
		const notePath = join(process.env.HOME, "quick-notes");
		await createDirIfNotExist(notePath);
		setDefaultNoteLocation(notePath);
		userConfig.notesFolderList.push(notePath);
		configMap.update("notesFolderList", userConfig.notesFolderList);
	}
})();

function setDefaultNoteLocation(notePath) {
	userConfig.notesLocation = notePath;
	configMap.update("notesLocation", notePath);
	statusBar.setToolTip();
}

export function changeFolder() {
	const quickPick = window.createQuickPick();
	quickPick.items = userConfig.notesFolderList.map((label) => ({ label }));
	quickPick.onDidChangeSelection((selection) => {
		const folderPath = selection[0].label;
		setDefaultNoteLocation(folderPath);
		quickPick.hide();
	});
	quickPick.onDidHide(() => quickPick.dispose());
	quickPick.show();
}
