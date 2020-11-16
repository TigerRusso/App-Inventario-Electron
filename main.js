const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
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
        height: 800,
        resizable: false,
        webPreferences: {
            nodeIntegration: true

        }
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`)


})

ipcMain.on('showModal', () => {
    childWindow = new BrowserWindow({
        parent: mainWindow,
        show: false,
        modal: true,
        width: 1200,
        height: 800,
        minimizable: false,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true

        }
    })
    childWindow.loadURL(`file://${path.join(__dirname, 'lista.html')}`)
    childWindow.once('ready-to-show', () => {
        childWindow.show()
    })
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        createWindow()
})

