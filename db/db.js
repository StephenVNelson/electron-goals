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
    get latest() {
      return (async _=>{
        let tasks = await this.all
        let lastTask = tasks
          .sort(
            (a,b)=> a.createdAt - b.createdAt
          )[tasks.length -1]
        return lastTask
      })()
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
    },
    /* receives an object of attribute:value and returns
    an instance(object)/instances(array of objets)
    that match the attributes:values */
    async where(properties) {
      // Error handling
      Object.keys(properties).forEach((property) => {
        if (!this.ATTRIBUTES.includes(property)) {
          throw new Error(`${property} is not a valid property`);
        }
      })

      let allInstances = await this.all
      Object.keys(properties).forEach((perameter) =>{
        allInstances = allInstances.filter((instance) => {
          return instance[perameter] == properties[perameter]
        })
      })
      return allInstances.length == 1 ? allInstances[0] : allInstances
    }
  }
}

const DB = Database('db')


module.exports = {DB, Database}
