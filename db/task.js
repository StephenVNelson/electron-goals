const {Database, DB} = require('./db.js')
const Task = Object.create(Database('tasks'))

Task.REQUIRED_ATTRS = ['description']
Task.create = async function(task) {
  let allTasks = await Task.all
  task.index = Task.newID
  task.sort = allTasks.length + 1
  task.createdAt = new Date()
  task.updatedAt = new Date()
  allTasks.push(task)
  await Task.updateWith(allTasks)
  // return await Task.all
}

module.exports = {Task}
