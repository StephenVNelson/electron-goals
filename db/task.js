const {Instance} = require('./instance.js')
const Task = Object.create(Instance)

Task.type = 'tasks'

Task.ATTRIBUTES = {
  id: {
    presence: true,
    create: false,
    update: false
  },
  sort: {
    presence: true,
    create: false,
    update: true,
  },
  description: {
    presence: true,
    create: true,
    update: true
  },
  createdAt: {
    presence: false,
    create: false,
    update: false
  },
  updatedAt: {
    presence: false,
    create: false,
    update: false
  }
}

Task.create = async function(task) {
  let allTasks = await Task.all
  task.id = this.setID()
  task.sort = allTasks.length + 1
  task.createdAt = new Date()
  task.updatedAt = new Date()
  this.validates(task)
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

Task.delete = async function(task) {
  this.validates(task)
  let allTasks = await Task.all
  let indexForTaskToDelete = allTasks.findIndex((qTask) => qTask.id === task.id)
  let taskToDelete = allTasks.splice(indexForTaskToDelete, 1)
  await Task.updateWith(allTasks)
  return taskToDelete
}

module.exports = {Task}
