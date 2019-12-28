const fs = require('fs')

function loadData() {
  rawData = fs.readFileSync('db/db.json')
  data = JSON.parse(rawData)
  return data
}

// Create
function createTask(task, callback) {
  loadData()
  task.id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
  task.sort = data.tasks.length + 1
  data.tasks.push(task)
  let newData = JSON.stringify(data, null, 2);
  fs.writeFile('db/db.json', newData, callback);
}

module.exports = {createTask, loadData}
