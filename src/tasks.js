const electron = require('electron')
const ipc = electron.ipcRenderer

let allTasksNodes = []
const allTasks = document.querySelector(".tasks")
const addButton = allTasks.querySelector(".tasks__add-button button")
const taskList = allTasks.querySelector(".tasks__list")
const newTaskTemplate = allTasks.querySelector('template.tasks__new-task-template')
const taskTemplate = allTasks.querySelector('template.tasks__task-template')


function gatherTaskData(event) {
  let form = event.target.parentElement
  let description = form.querySelector("input[name=description]").value
  return {
    description: description
  }
}

function createForm(eventCallback) {
  let newNode = document.importNode(newTaskTemplate.content, true)
  let newNodeSubmitButton = newNode.querySelector('button')
  let newNodeTextInput = newNode.querySelector('input[name=description]')
  newNodeSubmitButton.addEventListener('click', eventCallback)
  newNodeTextInput.onkeydown = function(e){
   if(e.keyCode == 13){
     eventCallback()
   }
  };
  taskList.appendChild(newNode)
}

function createTask(task) {
  let inputValue = task.description
  let newNode = document.importNode(taskTemplate.content, true)
  newNode.querySelector(".tasks__task-description").textContent = inputValue
  allTasksNodes.push(newNode)
}

function updateTasks() {
  allTasksNodes.forEach( task => {taskList.appendChild(task)})
}

function clearTaskNodes() {
  allTasksNodes = []
  while (taskList.firstChild) {taskList.removeChild(taskList.firstChild)}
}

function jsonToTasks(json) {
  clearTaskNodes()
  for (let task of json.tasks) {
    createTask(task)
  }
  updateTasks()
}

module.exports = {jsonToTasks, addButton, createForm, gatherTaskData}
