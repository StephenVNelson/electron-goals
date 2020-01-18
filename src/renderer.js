const electron = require('electron')
const ipc = electron.ipcRenderer
const tasks = require('./tasks.js')

window.addEventListener('DOMContentLoaded', () => {
  ipc.send('startDBLoad')
})

ipc.on('loadDB', (ext, taskList)=>{
  tasks.arrayToTasks(taskList)
})


tasks.addButton.addEventListener('click', e => {
  let newForm = tasks.createForm(null, _=> {
    let data = tasks.gatherTaskData(event)
    ipc.send('insertIntoDB', data)
  })
  e.target.parentElement.insertBefore(newForm, e.target)
})

ipc.on('postError', (ext, err)=>{
  tasks.postError(err.message)
})
