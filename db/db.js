const fs = require('fs')

function Database(type="db") {
  return {
    /* PROPERTIES */
    test: false,
    type,

    /* GETTERS */
    get dbFileName() {
      if (this.test === false) {
        return 'db/mainDB.json'
      } else {
        return 'db/testDB.json'
      }
    },
    get dbData() {return this.loadData()},
    get all() {
      if (this.type === "db") {
        return this.loadData()
      }
      else { return this.loadData()[this.type].instances}
    },

    /* METHODS */
    loadData() {
      var rawData = fs.readFileSync(this.dbFileName)
      return JSON.parse(rawData)
    }
  }
}

const DB = Database('db')


module.exports = {DB, Database}
