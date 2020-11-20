const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron')
const path = require('path')
Menu.setApplicationMenu(false)
/*
require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
}) */

let mainWindow;
let childWindow;


app.on('ready', () => {

    mainWindow = new BrowserWindow({
        show: false,
        width: 1200,
        height: 600,
        icon: path.join(__dirname, './assets/iconApp.ico'),
        resizable: false,     
        frame: false,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)

    //mainWindow.webContents.openDevTools()
})

ipcMain.on('showModal', () => {
    childWindow = new BrowserWindow({
        parent: mainWindow,
        show: false,
        modal: true,
        width: 1200,
        height: 800,
        frame: false,
        icon: path.join(__dirname, './assets/iconApp.ico'),
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true

        }
    })
    childWindow.loadURL(`file://${path.join(__dirname, 'lista.html')}`)
    //childWindow.webContents.openDevTools()
    childWindow.once('ready-to-show', () => {
        childWindow.show()

    })
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        createWindow()
})

if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) { }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':

            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};