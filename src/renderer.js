const electron = require('electron')
const ipc = electron.ipcRenderer
const tasks = require('./tasks.js')

window.addEventListener('DOMContentLoaded', () => {
  ipc.send('startDBLoad')
})

ipc.on('loadDB', (ext, data)=>{
  tasks.jsonToTasks(data)
})


tasks.addButton.addEventListener('click', e => {
  let newForm = tasks.createForm(null, _=> {
    let data = tasks.gatherTaskData(event)
    ipc.send('insertIntoDB', data)
  })
  e.target.parentElement.insertBefore(newForm, e.target)
})
