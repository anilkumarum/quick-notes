import * as vscode from "vscode";
import "./utils/status-bar.js";
import { join } from "path";
import { userConfig } from "./utils/config.js";
import { getDailyNotePath, getNewNotePath } from "./utils/create-note.js";

export async function activate(context: vscode.ExtensionContext) {
	const storeDb = context.workspaceState;

	const noteOpener = async ({ path }) => {
		const notePath = join(userConfig.notesLocation, path);
		await openNote(notePath).catch((err) => console.error(err));
		storeDb.update("lastNote", notePath);
	};

	function openDailyNotes() {
		getDailyNotePath()
			.then(openNote)
			.catch((err) => vscode.window.showErrorMessage(err));
	}
	function addNewNote() {
		getNewNotePath()
			.then(openNote)
			.catch((err) => vscode.window.showErrorMessage(err));
	}

	function defaultHandler() {
		if (userConfig.defaultNotes === "Last Note") {
			const notePath: string = storeDb.get("lastNote");
			openNote(notePath);
		} else if (userConfig.defaultNotes === "Daily Notes") {
			vscode.commands.executeCommand("quicknotes.openDailyNotes");
		}
	}

	function folderHandler() {
		const notesFolderUri = vscode.Uri.parse(userConfig.notesLocation);
		vscode.commands.executeCommand("revealFileInOS", notesFolderUri);
	}

	const disposableQuickNotes = vscode.commands.registerCommand("quicknotes.openNotes", noteOpener);

	const disposableDefaultNotes = vscode.commands.registerCommand("quicknotes.openDefaultNotes", defaultHandler);

	const disposableDailyNotes = vscode.commands.registerCommand("quicknotes.openDailyNotes", openDailyNotes);

	const disposableNewNote = vscode.commands.registerCommand("quicknotes.addNewNote", addNewNote);

	const disposableNotesFolder = vscode.commands.registerCommand("quicknotes.openNotesFolder", folderHandler);

	context.subscriptions.push(disposableNotesFolder);
	context.subscriptions.push(disposableQuickNotes);
	context.subscriptions.push(disposableDefaultNotes);
	context.subscriptions.push(disposableNewNote);
	context.subscriptions.push(disposableDailyNotes);

	async function openNote(notePath: string) {
		try {
			const textDoc = await vscode.workspace.openTextDocument(notePath);
			await vscode.window.showTextDocument(textDoc, 2, false);
		} catch (error) {
			console.error(error);
		}
	}
}

export function deactivate() {}
