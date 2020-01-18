// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const {Database} = require('../db/db.js')
const {Task} = require('../db/task.js')

let mainWindow

if(process.env.NODE_ENV === 'test'){
    Task.test = true
}
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

async function updateTasks(){
  let allTasks = await Task.all
  mainWindow.webContents.send('loadDB', allTasks)
}

ipcMain.on('startDBLoad', async _=> {
  updateTasks()
})

ipcMain.on('insertIntoDB', async (evt, data)=> {
  try{
    await Task.create(data);
    updateTasks()
  }
  catch(err) {
    mainWindow.webContents.send('postError', {
      message: err.message,
      stack: err.stack
    })
  }
})

ipcMain.on('deleteFromDB', async (evt, data)=>{
  await Task.delete(data);
  updateTasks()
})

ipcMain.on('editTask', async (evt, taskData)=>{
  await Task.update(data);
  updateTasks()
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
