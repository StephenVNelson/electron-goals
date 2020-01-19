const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.

const {Task} = require('../src/backend/task.js')
Task.test = true // this must be true in order to use the test database
const fs = require('fs')
const {promises} = fs
const path = require('path')
const {DB} = require('../src/backend/db.js')


async function resetToBoilerPlate(){
  const testDBBP = await promises.readFile('db/testDBBoilerplate.json', 'utf8')
  const testDB = await promises.readFile('db/testDB.json', 'utf8')
  var editTestDBBP = JSON.parse(testDBBP)
  var editTestDB = JSON.parse(testDB)
  for (let key in editTestDB) {
    if (key === 'name') {continue;}
    else {editTestDB[key] = editTestDBBP[key]}
  }
  var changedTestDB = JSON.stringify(editTestDB, null, 2).concat('\n')
  await promises.writeFile('db/testDB.json', changedTestDB)
}
describe('Working off of testDB', function(){
  beforeEach(resetToBoilerPlate)
  afterEach(resetToBoilerPlate)

  it('has #dbFileName attribute', function(){
    assert.notEqual(Task.dbFileName, undefined)
  })

  it('has a #test attribute set to true', function(){
    assert.equal(Task.test, true)
  })

  it('Returns the test database name for #dbFileName', function(){
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

  it('Asynchronously returns the #loadData', async function(){
    const asyncDB = await Task.loadData()
    var stringed = JSON.stringify(asyncDB)
    const syncDB = JSON.stringify(JSON.parse(fs.readFileSync(Task.dbFileName)))
    assert.equal(stringed, syncDB)
  })

  it('Asynchronously returns #all', async function(){
    const all = await Task.all
    let stringed = JSON.stringify(all)
    let rawData = fs.readFileSync(Task.dbFileName)
    let allSync = JSON.stringify(
      JSON.parse(rawData)[Task.type].instances
    )
    assert.equal(stringed, allSync)
  })

  describe('Task DB/Queries', function(){
    it('returns #all of the tasks in the boilerplate', async function(){
      let tasks = await Task.all
      assert.equal( tasks.length, 3)
    })
    it('returns the test db filesname', function(){
      assert.equal(Task.dbFileName, 'db/testDB.json')
    })
    it('returns the main db filename when test is false', function(){
      Task.test = false
      assert.equal(Task.dbFileName, 'db/mainDB.json')
      Task.test = true
    })
    it('only returns the tasks on #all', async function(){
      let tasks = await Task.all
      assert.strictEqual(Array.isArray(tasks), true);
      ['description', 'id', 'sort'].forEach( propertyName => {
        assert.strictEqual(
          Object.getOwnPropertyNames(tasks[0]).includes(propertyName), true
        )
      })
      assert.equal(tasks.length, 3)
    })
    it('returns the whole db on #dbData', async function(){
      let db = await Task.dbData
      assert.strictEqual(Array.isArray(db), false);
      ['lastUpdated', 'name', 'tasks'].forEach( propertyName => {
        assert.strictEqual(
          Object.getOwnPropertyNames(db).includes(propertyName), true
        )
      })
    })
    it('generates a unique id', function(){
      let task1 = Object.create(Task)
      let task2 = Object.create(Task)
      task1.setID()
      assert.equal(task1.id.length, 13)
      assert.notEqual(task1.id, task2.id)
    })
    it('returns the #latest created task', async function(){
      let latestTask = await Task.latest
      assert.equal(latestTask.sort, 3)
      assert.equal(latestTask.description, "Test Task 3")
      await Task.create({description: "I am a new task"})
      let themAll = await Task.all
      let nextLatestTask = await Task.latest
      assert.equal(nextLatestTask.description, "I am a new task")
    })
    describe('Queries the DB with #where', function(){
      it('returns instance #where criteria if there is only 1 match', async function(){
        let allTasks = await Task.all
        let randomTask = allTasks[Math.floor(Math.random() * allTasks.length)];
        let taskById = await Task.where({id: randomTask.id})
        let taskBySort = await Task.where({sort: randomTask.sort})
        let taskByDescription = await Task.where(
          {description: randomTask.description}
        )
        let taskByDescriptionSort = await Task.where(
          {description: randomTask.description, sort: randomTask.sort}
        )
        let taskByDescriptionSortID = await Task.where(
          {
            description: randomTask.description,
            sort: randomTask.sort,
            id: randomTask.id
          }
        )
        assert.equal(Array.isArray(taskById), false)
        assert.equal(JSON.stringify(randomTask), JSON.stringify(taskById))
        assert.equal(
          JSON.stringify(randomTask), JSON.stringify(taskByDescriptionSort)
        )
        assert.equal(
          JSON.stringify(randomTask), JSON.stringify(taskByDescriptionSortID)
        )
      })
      it('returns an error if the user gives a non-eistant perameter', async function(){
        try {
          await Task.where({discription: "Hello"})
        } catch(e) {
          assert.equal(e.message, "discription is not a valid property")
        }

      })
      it('returns an array of all instances #where criteria if there are more than 1 matches', async function(){
        await Task.create({description: "I am not unique"})
        await Task.create({description: "I am not unique"})
        let twoTasks = await Task.where({description: "I am not unique"})
        assert.equal(twoTasks.length, 2)
        assert.equal(twoTasks[0].description, "I am not unique")
        assert.equal(twoTasks[1].description, "I am not unique")
      })
    })
  })

  describe('Task #validations', function(){
    it('Validates presence of required properties', async function(){
      await assert.rejects(async ()=> await Task.create({description: ""}),{
        message: 'description must contain a value'
      })
    })
    it('returns #attrsByProperty', function(){
      let hasPresence = Task.attrByProperty('presence', true)
      let hasUpdate = Task.attrByProperty('update', true)
      assert.equal(hasPresence.includes('id'), true)
      // assert.equal(hasUpdate[0], 'id')
    })
    it('Validates uniqueness of IDs and Sort')
  })

  describe('Task #create', function(){
    it('#create task', async function(){
      let newTask = await Task.create({id: "", sort: "", description: "I am a new task"})
      let tasks = await Task.all
      assert.equal(tasks.length, 4)
      let lastTask = await Task.latest
      assert.equal(lastTask.description, "I am a new task")
    })
    it("returns the new created task after it's inserted into the db", async function(){
      let newTask = await Task.create({description: "I am returned after inserted"})
      assert.equal(newTask.description, "I am returned after inserted")
    })
  })

  describe('Task #edit', function(){
    it('#updates a task with valid attributes', async function(){
      let latestTask = await Task.latest
      let newTask = {
        id: latestTask.id,
        sort: latestTask.sort,
        description: "This task has been edited"
      }
      await Task.update(newTask)
      let updatedTask = await Task.latest
      assert.equal(updatedTask.description, "This task has been edited")
    })
    it('does not #updates a task with invalid attributes')
  })

  describe('Task #delete', function(){
    it('#deletes a task with valid attributes', async function(){
      let allTasks = await Task.all
      assert.equal(allTasks.length, 3)
      let taskToDelete = allTasks[0]
      await Task.delete({id: taskToDelete.id})
      let newTasks = await Task.all
      assert.equal(newTasks.length, 2)
    })
  })

  describe('Task #delete', function(){

  })
})

describe('Application launch', function () {
  let debuggerMode = true
  debuggerMode ? this.timeout(100000000000) : this.timeout(10000)

  beforeEach(function () {
    app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..')],
      env: "Test"
    })
    return app.start()
  })

  afterEach(function () {
    if (app && app.isRunning()) {
      resetToBoilerPlate()
      return app.stop()
    }
  })

  it.skip('shows an initial window', function () {
    return app.client.getWindowCount().then(function (count) {
      assert.equal(count, 2)
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
      assert.equal(count, 2)
    })
  })
  it.skip('does not have the developer tools open', async () => {
    const devToolsAreOpen = await app.client
      .waitUntilWindowLoaded()
      .browserWindow.isDevToolsOpened();
    return assert.equal(devToolsAreOpen, false);
  });



  it("adds a new task", async function () {
    let initialTasks = await Task.all
    await app.client.element('.tasks__add-button button').click()
    await app.client.$("input[name='description']").addValue('test')
    await app.client.$('.tasks__add-button li button').click()
    let addedTask = await Task.all
    assert.notEqual(initialTasks.length, addedTask.length)
  });
  it("does not add an empty task", async function(){
    let initialTasks = await Task.all
    await app.client.element('.tasks__add-button button').click()
    await app.client.$('.tasks__add-button li button').click()
    let addedTask = await Task.all
    assert.equal(initialTasks.length, addedTask.length)
    let elementExist = await app.client.isExisting('.error__message')
    assert.equal(elementExist, true)
  })
  it("edits a task from the browser",async function () {
    await app.client.waitUntilWindowLoaded()
    let editButton = app.client
      .$("div[data-task-id='K4QM5M1PJI92M']")
      .$('.tasks__edit')
    await editButton.click()
    await app.client
      .$("input[value='K4QM5M1PJI92M']")
      .$('..')
      .$("input[name='description']")
      .setValue('Edited Task')
    await app.client
      .$("input[value='K4QM5M1PJI92M']")
      .$('..')
      .$('button')
      .click()
    let newLastTask = await Task.latest
    assert.equal(newLastTask.description, 'Edited Task')
    let lastTaskText = await app.client
      .$("div[data-task-id='K4QM5M1PJI92M']")
      .$(".tasks__task-options")
      .getText()
    assert(lastTaskText, 'Edited Task')
    // await app.client.debug()
  });
})
