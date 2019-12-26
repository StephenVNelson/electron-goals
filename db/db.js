const fs = require('fs')
let rawData = fs.readFileSync('db/db.json')
let data = JSON.parse(rawData)

function loadData() {
  rawData = fs.readFileSync('db/db.json')
  data = JSON.parse(rawData)
  return data
}

// Create
function createTask(task, callback) {
  task.sort = data.tasks.length + 1
  data.tasks.push(task)
  let newData = JSON.stringify(data, null, 2);
  fs.writeFile('db/db.json', newData, callback);
}

module.exports = {data, createTask, loadData}
