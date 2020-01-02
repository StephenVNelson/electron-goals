const fs = require('fs')



function loadData() {
  rawData = fs.readFileSync('db/db.json')
  data = JSON.parse(rawData)
  sortedData = reSort(data)
  return sortedData
}

const tasks = {
  count: loadData().tasks.length
}

function reSort(data) {
  for (let i = 0; i < data.tasks.length; i++) {
    data.tasks[i].sort = i + 1
  }
  fs.writeFileSync('db/db.json', JSON.stringify(data, null, 2))
  return data
}

function generateID() {
  return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
}

// Create
function createTask(task, callback) {
  loadData()
  task.id = generateID()
  task.sort = data.tasks.length + 1
  data.tasks.push(task)
  let newData = JSON.stringify(data, null, 2);
  fs.writeFile('db/db.json', newData, callback);
}

// Edit
function editTask(taskData, callback) {
  let data = loadData()
  if (data.tasks[taskData.sort - 1].id == taskData.id) {
    let task = data.tasks[taskData.sort - 1]
    for (attr in task) {
      task[attr] = taskData[attr]
    }
  } else {
    let taskIndex = data.tasks.indexOf(data.tasks.find(task => task.id == taskData.id))
    let task = data.tasks[taskIndex]
    for (attr in task) {
      task[attr] = taskData[attr]
    }
  }
  let newData = JSON.stringify(data, null, 2)
  fs.writeFile('db/db.json', newData, callback);
}

// Delete
function deleteTask(taskID, taskSortNumber, callback) {
  let data = loadData()
  if (data.tasks[taskSortNumber - 1].id == taskID) {
    data.tasks.splice(taskSortNumber - 1, 1)
  } else {
    let taskIndex = data.tasks.indexOf(data.tasks.find(task => task.id == taskID))
    data.tasks.splice(taskIndex, 1)
  }
  let newData = JSON.stringify(data, null, 2)
  fs.writeFile('db/db.json', newData, callback);
}

module.exports = {createTask, loadData, deleteTask, editTask, tasks}
