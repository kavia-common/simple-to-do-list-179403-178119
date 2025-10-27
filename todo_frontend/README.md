# React To-do App (sql.js + IndexedDB)

A modern to-do application built with React and in-browser SQLite via sql.js. Data is persisted to IndexedDB so your tasks survive refreshes in the same browser profile.

## Features
- Local SQLite database (sql.js WebAssembly)
- IndexedDB persistence (idb-keyval)
- Add, view, edit, toggle complete, and delete tasks
- Ocean Professional theme (blue primary, amber accents)
- Accessible controls and keyboard-friendly editing
- Basic unit tests with mocked DB layer for speed

## Getting Started

Install dependencies:
- npm install

Note: sql.js and idb-keyval are required. The wasm file (sql-wasm.wasm) will be copied automatically on start/build.

Start the app (dev server on http://localhost:3000):
- npm start

Run tests:
- npm test

Build for production:
- npm run build

## WebAssembly (wasm) note

sql.js requires a wasm file: `sql-wasm.wasm`. This repository includes a small script that copies the wasm from `node_modules/sql.js/dist` to `public/sql-wasm.wasm` automatically during `npm start` and `npm run build`.

If you see errors loading the wasm, ensure the file exists at:
- todo_frontend/public/sql-wasm.wasm

The app uses:
- locateFile: () => `${process.env.PUBLIC_URL}/sql-wasm.wasm`

Note on sql.js loading:
- To avoid bundling Node-specific code (which references 'fs'), the app loads sql.js at runtime via CDN and initializes it in the browser.
- The WebAssembly file itself is still served locally from `public/sql-wasm.wasm` for reliability.

## Persistence

The SQLite database is exported to bytes and saved in IndexedDB under key `todo-db`. On load, the app restores from these bytes if present; otherwise it creates a new database and runs the schema.

## Project Structure (relevant files)
- src/components/TodoApp.jsx — App container, DB initialization, state
- src/components/TodoInput.jsx — Add input
- src/components/TodoList.jsx — List
- src/components/TodoItem.jsx — Single item controls
- src/db/sqliteClient.js — sql.js initialization, CRUD, persistence
- src/db/schema.sql — SQL schema for tasks table
- src/utils/storage.js — IndexedDB get/set using idb-keyval
- src/App.css, src/index.css — Ocean Professional theme styles

## Schema
- tasks(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0, created_at INTEGER)

## Accessibility
- Inputs and buttons include labels or aria-labels
- Keyboard: Enter to save edits, Escape to cancel
- Focus rings visible for inputs and buttons

## Troubleshooting
- Wasm not loading? Verify `public/sql-wasm.wasm` exists.
- Clearing data: clear the site’s IndexedDB storage from browser dev tools.
