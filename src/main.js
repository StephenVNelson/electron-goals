// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const db = require('../db/db.js')

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('src/tasks.html')
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
app.on('ready', _=>{
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

ipcMain.on('startDBLoad', _=> {
  mainWindow.webContents.send('loadDB', db.loadData())
})

ipcMain.on('insertIntoDB', (evt, data)=> {
  db.createTask(data, err => {
    if (err) {throw err}
    else {
      mainWindow.webContents.send('loadDB', db.loadData())
    }
  });
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
