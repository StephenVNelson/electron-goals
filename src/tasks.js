console.log("tasks.js");
const tasks = document.querySelector(".tasks")
const addButton = tasks.querySelector(".tasks__add-button button")
const taskList = tasks.querySelector(".tasks__list")
const newTaskTemplate = tasks.querySelector('template.tasks__new-task-template')
const taskTemplate = tasks.querySelector('template.tasks__task-template')


function submitNewTask(event) {
  let form = event.target.parentElement
  let inputValue = form.querySelector("input[name=description]").value
  let newNode = document.importNode(taskTemplate.content, true)
  newNode.querySelector(".tasks__task-description").textContent = inputValue
  taskList.replaceChild(newNode, form)
}

addButton.addEventListener('click', _=> {
  let newNode = document.importNode(newTaskTemplate.content, true)
  let newNodeSubmitButton = newNode.querySelector('button')
  let newNodeTextInput = newNode.querySelector('input[name=description]')
  newNodeSubmitButton.addEventListener('click', submitNewTask)
  newNodeTextInput.onkeydown = function(e){
   if(e.keyCode == 13){
     submitNewTask(e)
   }
};
  let lastNode = taskList.lastElementChild
  taskList.insertBefore(newNode, lastNode)
})
