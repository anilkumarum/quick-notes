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
		setTimeout(() => this.#init(), 0);
	}

	#init() {
		this.#statusBarItem.text = `$(output) Notes`;
		this.#statusBarItem.command = "quicknotes.openDefaultNotes";
		this.#statusBarItem.show();
		this.setToolTip();
	}

	async setToolTip() {
		const notesTree = await createDirTree(userConfig.notesLocation);
		const tooltip = new vscode.MarkdownString(`Quick Notes<br>
		[➕ New Note](command:quicknotes.addNewNote)<br>
		[🗓 Daily Notes](command:quicknotes.openDailyNotes)<br>
		${this.#noteFolder(notesTree.root)}
		${userConfig.showFolderLocation ? `[📔 Open Folder](command:quicknotes.openNotesFolder)` : ""} `);
		tooltip.supportHtml = true;
		tooltip.isTrusted = true;
		this.#statusBarItem.tooltip = tooltip;
	}

	#noteFolder(noteArr) {
		return noteArr
			.map((note) =>
				note.isDirectory
					? `<details>
							<summary><span>📂 ${note.name}</span></summary>
							<ul>${this.#noteFolder(note.files)}</ul>
						</details>`
					: `<div>
						<a href="command:quicknotes.openNotes?${getPath(note.path)}">📝 ${note.name}</a>
					</div>`
			)
			.join("");
	}

	hide() {
		this.#statusBarItem.hide();
	}
}
export default new StatusBar();
