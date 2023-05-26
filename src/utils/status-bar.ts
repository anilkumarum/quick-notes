import * as vscode from "vscode";
import { createDirTree } from "./notesTree.js";
import { userConfig } from "./config.js";

function getPath(path) {
	return encodeURI(JSON.stringify({ path }));
}

class StatusBar {
	#statusBarItem: vscode.StatusBarItem;
	constructor() {
		this.#statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 3);
		this.#init();
	}

	async #init() {
		this.setText(`$(output) Notes`);
		const notesTree = await createDirTree(userConfig.notesLocation);
		this.#statusBarItem.tooltip = this.#setToolTip(notesTree);
		this.#statusBarItem.command = "quicknotes.openDefaultNotes";
		this.#statusBarItem.show();
	}

	#setToolTip(notesTree) {
		const tooltip = new vscode.MarkdownString(`Quick Notes<br>
		[➕ New Note](command:quicknotes.addNewNote)<br>
		[🗓 Daily Notes](command:quicknotes.openDailyNotes)<br>
		${this.noteFolder(notesTree.root)}
		${userConfig.showFolderLocation ? `[📔 Open Folder](command:quicknotes.openNotesFolder)` : ""} `);
		tooltip.supportHtml = true;
		tooltip.isTrusted = true;
		return tooltip;
	}

	noteFolder(noteArr) {
		return noteArr
			.map((note) =>
				note.isDirectory
					? `<details>
							<summary><span>📂 ${note.name}</span></summary>
							<ul>${this.noteFolder(note.files)}</ul>
						</details>`
					: `<div>
						<a href="command:quicknotes.openNotes?${getPath(note.path)}">📝 ${note.name}</a>
					</div>`
			)
			.join("");
	}

	setText(text: string) {
		this.#statusBarItem.text = text;
	}

	hide() {
		this.#statusBarItem.hide();
	}
}

export default new StatusBar();
