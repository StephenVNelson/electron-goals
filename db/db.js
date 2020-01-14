const fs = require('fs')

Database =  {
    /* PROPERTIES */
    test: false,

    /* GETTERS */
    get dbFileName() {
      if (this.test === false) {
        return 'db/mainDB.json'
      } else {
        return 'db/testDB.json'
      }
    },
    get dbData() {return this.loadData()},


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



module.exports = {Database}
