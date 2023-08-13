const windowStateManager = require('electron-window-state');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const contextMenu = require('electron-context-menu');
const serve = require('electron-serve');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

const appDataPath = `${app.getPath('appData')}/Livre/data.json`
let libraryDataPath = ''

try {
	require('electron-reloader')(module);
} catch (e) {
	console.error(e);
}

const serveURL = serve({ directory: '.' });
const port = process.env.PORT || 5173;
const dev = !app.isPackaged;
/** @type {import('electron').BrowserWindow} */
let mainWindow;

function createWindow() {
	let windowState = windowStateManager({
		defaultWidth: 800,
		defaultHeight: 600,
	});

	const mainWindow = new BrowserWindow({
		autoHideMenuBar: true,
		titleBarStyle: 'hidden',
		backgroundColor: '#0d1117',
		titleBarOverlay: {
			color: '#0d1117',
			symbolColor: '#ac65ff',
			height: 40
		  },
		// trafficLightPosition: {
		// 	x: 17,
		// 	y: 32,
		// },
		minHeight: 525,
		minWidth: 700,
		webPreferences: {
			enableRemoteModule: true,
			contextIsolation: true,
			nodeIntegration: true,
			spellcheck: false,
			devTools: dev,
			preload: path.join(__dirname, 'preload.cjs'),
		},
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
	});

	windowState.manage(mainWindow);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on('close', () => {
		windowState.saveState(mainWindow);
	});

	return mainWindow;
}

contextMenu({
	showLookUpSelection: false,
	showSearchWithGoogle: false,
	showCopyImage: false,
	showSelectAll:false,
	showInspectElement:()=>{if (!dev) false},
	// prepend: (defaultActions, params, browserWindow) => [
	// 	{
	// 		label: 'Make App 💻',
	// 	},
	// ],
});

function loadVite(port) {
	mainWindow.loadURL(`http://localhost:${port}`).catch((e) => {
		console.log('Error loading URL, retrying', e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

function createMainWindow() {
	mainWindow = createWindow();
	mainWindow.once('close', () => {
		mainWindow = null;
	});

	if (dev) loadVite(port);
	else serveURL(mainWindow);
}

app.once('ready', createMainWindow);
app.on('activate', () => {
	if (!mainWindow) {
		createMainWindow();
	}
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('to-main', (event, count) => {
	return mainWindow.webContents.send('from-main', `next count is ${count + 1}`);
});

ipcMain.on('createFile', (event) => {
	let folder = ''
	let canceled = false
	dialog.showOpenDialog({
		properties: ['openDirectory', 'dontAddToRecent'],
		defaultPath: app.getPath('documents')
	}).then(res => {
		folder = res.filePaths
		canceled = res.canceled
		
		if ( !canceled ) {
			fs.mkdir(`${app.getPath('appData')}/livre`, {recursive: true}, (err) => {
				if (err) {
					return console.log(error)
				}
			})
			fs.writeFile(appDataPath, `{"path":"${folder}/livre.library"}`, (err) => {
				if (err)
				  console.log(err) 
			})
			fs.writeFile(`${folder}/livre.library`, '{"data":[]}', (err) => {
				if (err)
				  console.log(err) 
			})
			mainWindow.webContents.reloadIgnoringCache()
		}
	})
	if (!folder || canceled) return
	return 

	// mainWindow.webContents.send('doneCreatingFile', `${folder}/livre.json`)
	// return 
})

ipcMain.on('openFile', (event) => {
	dialog.showOpenDialog({
		properties: ['openFile', 'dontAddToRecent'],
		defaultPath: app.getPath('documents'),
		filters: [
			{name: 'Livre Library', extensions: ['library']}
		]
	}).then(res => {
		filePath = res.filePaths
		canceled = res.canceled
		
		if ( !canceled ) {
			fs.mkdir(`${app.getPath('appData')}/livre`, {recursive: true}, (err) => {
				if (err) {
					return console.log(error)
				}
			})
			fs.writeFile(appDataPath, `{"path":"${filePath}"}`, (err) => {
				if (err)
				  console.log(err) 
			})
			mainWindow.webContents.reloadIgnoringCache()
		}
	})
})
const readData = () => {
	if (fs.existsSync(appDataPath)){
		fs.readFile(appDataPath, 'utf-8', (err, data)=>{
			if (err){
				return console.log(err);
			}
			data = data.replaceAll('\\','/')
			mainWindow.webContents.send('getData', data)
			const path = JSON.parse(data).path
			libraryDataPath = path
			if (fs.existsSync(path)) {
				fs.readFile(path, 'utf-8', (err, data)=>{
					if (err){
						return console.log(err);
					}
					data = JSON.parse(data)
					const output = {path, data}
					mainWindow.webContents.send('getData', output)
				})
			} else {
				mainWindow.webContents.send('getData', { path: null, data: null })
			}
		})} else {
			mainWindow.webContents.send('getData', { path: null, data: null })
		}
}
ipcMain.on('readAppData', (event) => {
	readData()
})

ipcMain.on('writeLibraryFile', (event, data) => {
	if (fs.existsSync(appDataPath) || fs.existsSync(libraryDataPath)) {
		fs.writeFile(libraryDataPath, data)
		readData()
	}
	else {
		mainWindow.webContents.send('getData', { path: null, data: null })
	}
})