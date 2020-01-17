const {Instance} = require('./instance.js')
const Task = Object.create(Instance)

Task.type = 'tasks'

Task.ATTRIBUTES = {
  id: {
    presence: true,
    update: false
  },
  sort: {
    presence: true,
    update: true,
  },
  description: {
    presence: true,
    update: true
  }
}

Task.create = async function(task) {
  this.validates(task)
  let allTasks = await Task.all
  task.id = this.setID()
  task.sort = allTasks.length + 1
  task.createdAt = new Date()
  task.updatedAt = new Date()
  allTasks.push(task)
  await Task.updateWith(allTasks)
  returnedTask = await Task.where({id: task.id})
  return returnedTask
}

Task.update = async function(task) {
  this.validates(task)
  let allTasks = await Task.all
  let updateIndex = allTasks.findIndex((qTask) => qTask.id === task.id)
  let taskToUpdate = allTasks[updateIndex]
  let attrsToUpdate = this.attrByProperty('update', true)
  attrsToUpdate.forEach((attr) => {
    taskToUpdate[attr] = task[attr]
  })
  taskToUpdate.updatedAt = new Date()
  allTasks.splice(updateIndex, 1, taskToUpdate)
  await Task.updateWith(allTasks)
  return await Task.where({id: taskToUpdate.id})
}

module.exports = {Task}
