const {Database, DB} = require('./db.js')

const Task = Object.create(Database('tasks'))

module.exports = {Task}
