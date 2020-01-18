const electron = require('electron')
const ipc = electron.ipcRenderer

// Array for building tasks nodes temporarily in memory
let allTasksNodes = []

// Important Nodes
const allTasks = document.querySelector(".tasks")
const addButton = allTasks.querySelector(".tasks__add-button button")
const taskList = allTasks.querySelector(".tasks__list")

//HTML Templates
const taskFormTemplate = allTasks
  .querySelector('template.tasks__task-form-template')
const taskTemplate = allTasks
  .querySelector('template.tasks__task-template')
const errorTemplate = document.querySelector('template.errors')


function gatherTaskData(event) {
  let form = event.target.parentElement
  let id = form.querySelector("input[name=id]").value
  let sort = form.querySelector("input[name=sort]").value
  let description = form.querySelector("input[name=description]").value
  return {id, sort, description}
}


function createForm(taskData = null, eventCallback) {
  let newNode = document.importNode(taskFormTemplate.content, true)
  if (taskData != null) {
    for (let attr in taskData) {
      newNode.querySelector(`input[name=${attr}]`).value = taskData[attr]
    }
  }
  let newNodeSubmitButton = newNode.querySelector('button')
  let newNodeTextInput = newNode.querySelector('input[name=description]')
  newNodeSubmitButton.addEventListener('click', eventCallback)
  newNodeTextInput.onkeydown = function(e){
   if(e.keyCode == 13){
     eventCallback()
   }
  };
  return newNode
}

function createTask(task) {
  let newNode = document.importNode(taskTemplate.content, true)
  let taskContainer = newNode.querySelector('.tasks__task-container')
  taskContainer.setAttribute('data-task-id', task.id)
  taskContainer.setAttribute('data-sort', task.sort)

  // Delete Task Event Listener
  newNode.querySelector('.tasks__delete').addEventListener('click', e => {
    let taskContainer = event.target.parentElement.parentElement
    let id = taskContainer.dataset.taskId
    let sort = taskContainer.dataset.sort
    ipc.send('deleteFromDB', {id: id})
  })

  // Edit Task Event Listener
  newNode.querySelector('.tasks__edit').addEventListener('click', e => {
    let taskContainer = event.target.parentElement.parentElement
    let id = taskContainer.dataset.taskId
    let sort = taskContainer.dataset.sort
    let description = taskContainer.querySelector('.tasks__task-description').textContent
    let taskData = {id, sort, description}
    let newForm = createForm(taskData , _=>{
      let data = gatherTaskData(event)
      ipc.send('editTask', data)
    })
    taskContainer.parentElement.replaceWith(newForm)
  })


  newNode.querySelector(".tasks__task-description").textContent = task.description
  allTasksNodes.push(newNode)
}

function updateTasks() {
  allTasksNodes.forEach( task => {taskList.appendChild(task)})
}

function clearTaskNodes() {
  allTasksNodes = []
  while (taskList.firstChild) {taskList.removeChild(taskList.firstChild)}
}

function arrayToTasks(tasks) {
  clearTaskNodes()
  tasks.forEach((task) => createTask(task))
  updateTasks()
}

function postError(err) {
  let newError = document.importNode(errorTemplate.content, true)
  newError.querySelector(".error__message").textContent = err
  let mainWindow = document.querySelector('.main-window')
  mainWindow.insertBefore(newError, errorTemplate)
}

module.exports = {arrayToTasks, addButton, createForm, gatherTaskData, postError}
