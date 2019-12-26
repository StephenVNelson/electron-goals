const electron = require('electron')
const ipc = electron.ipcRenderer

let allTasksNodes = []
const allTasks = document.querySelector(".tasks")
const addButton = allTasks.querySelector(".tasks__add-button button")
const taskList = allTasks.querySelector(".tasks__list")
const enumeratedList = taskList.querySelector(".tasks__enumerated")
const buttonLi = taskList.lastElementChild
const newTaskTemplate = allTasks.querySelector('template.tasks__new-task-template')
const taskTemplate = allTasks.querySelector('template.tasks__task-template')


function submitNewTask(event) {
  let form = event.target.parentElement
  let inputValue = form.querySelector("input[name=description]").value
  //send info to the system.
  // I want to keep the send signals in the renderer, but the listening signals are all here...


  // let newNode = document.importNode(taskTemplate.content, true)
  // newNode.querySelector(".tasks__task-description").textContent = inputValue
  // taskList.replaceChild(newNode, form)
}

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
     gatherTaskData()
   }
  };
  enumeratedList.appendChild(newNode)
}

function createTask(task) {
  let inputValue = task.description
  let newNode = document.importNode(taskTemplate.content, true)
  newNode.querySelector(".tasks__task-description").textContent = inputValue
  allTasksNodes.push(newNode)
}

function updateTasks() {
  allTasksNodes.forEach( task => {enumeratedList.appendChild(task)})
}

function clearTaskNodes() {
  allTasksNodes = []
  while (enumeratedList.firstChild) {enumeratedList.removeChild(enumeratedList.firstChild)}
}

function jsonToTasks(json) {
  clearTaskNodes()
  for (let task of json.tasks) {
    createTask(task)
  }
  updateTasks()
}

module.exports = {jsonToTasks, addButton, createForm, gatherTaskData}
