# Quick notes in sidebar

Quick notes is any file format sticky notes for quick access.

![quick-notes](https://raw.githubusercontent.com/anilkumarum/quick-notes/master/quick-notes.png)

# Features

- Quick notes in sidebar
- One click to re-open last-note or daily-note
- Daily notes support
- any file format supported
- Less than 5 kb size
- Multi notes folder location. Easy to switch between them.

# Extension Settings

This extension contributes the following settings:

- `quicknotes.config.notesFolderList`: list of notes folders
  Add one or more note folders into this array.
  Quickly change default folder by running this command: `quicknotes.changeNotesFolder`

- `quicknotes.config.defaultNotes`:
  When you click on status bar,default node is opened.
  Be default, last opened note is configured.
  You can switch between **last note** or **daily note**

- `quicknotes.config.showFolderLocation`:Reveal notes location in os file explorer

# How to use

1. You may want to set `quicknotes.config.notesLocation` in vscode setting
2. Hover over `Notes` on side and click on `New Note` to create new note.

- Use `ctrl+alt+n` keyboard shortcuts to open default node (last note or daily note)

# FAQs

## How to configure the settings in my project?

Create a `.vscode` folder in the root of project. Inside of `.vscode` folder create a json file named `settings.json`.
Inside of the `settings.json`, type following key-value pairs. By the way you'll get intellisense.
