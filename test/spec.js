const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.

const {Task} = require('../db/task.js')
Task.test = true
const {fs, promises} = require('fs')
const path = require('path')
const db = require('../db/db.js')


// describe('Application launch', function () {
//   let debuggerMode = true
//   debuggerMode ? this.timeout(100000000000) : this.timeout(10000)
//
//   beforeEach(function () {
//     app = new Application({
//       path: electronPath,
//       args: [path.join(__dirname, '..')]
//     })
//     return app.start()
//   })
//
//   afterEach(function () {
//     if (app && app.isRunning()) {
//       revertData()
//       return app.stop()
//     }
//   })
//
//   it('shows an initial window', function () {
//     return app.client.getWindowCount().then(function (count) {
//       assert.equal(count, 2)
//       // Please note that getWindowCount() will return 2 if `dev tools` are opened.
//       // assert.equal(count, 2)
//     })
//   })
//
//   it("adds a new task", async function () {
//     await app.client.element('.tasks__add-button button').click()
//     await app.client.$("input[name='description']").addValue('test')
//     await app.client.debug()
//     assert.notEqual(realDB.tasks.length, testDB.tasks.length)
//   });
// })

describe('Working off of testDB', function(){

  beforeEach(async function(){
    const testDBBP = await promises.readFile('db/testDBBoilerplate.json')
    const testDB = await promises.readFile('db/testDB.json')
    var editTestDBBP = JSON.parse(testDBBP)
    var editTestDB = JSON.parse(testDB)
    for (let key in editTestDB) {
      if (key === 'name') {continue;}
      else {editTestDB[key] = editTestDBBP[key]}
    }
    var changedTestDB = JSON.stringify(editTestDB, null, 2)
    await promises.writeFile('db/testDB.json', changedTestDB)
  })

  it('has #db name attribute', function(){
    assert.notEqual(Task.dbFileName, undefined)
  })

  it('has a #test attribute set to true', function(){
    assert.equal(Task.test, true)
  })

  it('Returns the test database for #db', function(){
    assert.equal(Task.dbFileName, 'db/testDB.json')
  })

  it('Returns a copy of the boilerplate', async function(){
    const testDB = await promises.readFile('db/testDB.json', "binary")
    const boilerplate = await promises.readFile('db/testDBBoilerplate.json', "binary")
    var parsedTestDB = JSON.parse(testDB)
    var parsedBP = JSON.parse(boilerplate)
    assert.notEqual(parsedTestDB, undefined)
    assert.notEqual(parsedBP, undefined)
    for (let key in parsedTestDB) {
      if (key === 'name') {continue}
      else {assert.equal(testDB[key], boilerplate[key])}
    }
  })

  describe('Task CRUD', function(){
    it('returns #all of the tasks in the boilerplate', function(){
      assert.equal(Task.all.length, 3)
    })
  })
})
