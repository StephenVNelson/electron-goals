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
      return (async ()=>{
        if (this.type === "db") {
          return await this.loadData()
        }
        else {
          var data = await this.loadData()
          return data[this.type].instances
        }
      })()
    },
    get newID() {
      return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
    },

    /* METHODS */
    async loadData() {
      var rawData = await fs.promises.readFile(this.dbFileName)
      return JSON.parse(rawData)
    },
    async updateWith(newData) {
      let allData = await this.loadData()
      allData[this.type].instances = newData;
      await fs.promises.writeFile(
        this.dbFileName,
        JSON.stringify(allData, null, 2).concat('\n')
      )
    }
  }
}

const DB = Database('db')


module.exports = {DB, Database}
