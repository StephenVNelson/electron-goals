const {Validate} = require('./validate.js')
Instance = Object.create(Validate)


Instance.setID = function() {
  let newID = (
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  ).toUpperCase()
  this.id = newID
}

Object.defineProperty(Instance, 'all', {
  async get() {
    let data = await this.loadData()
    return data[this.type].instances
  }
})

Object.defineProperty(Instance, 'latest', {
  async get() {
    let sortedProperties = await this.orderBy('createdAt')
    return sortedProperties[sortedProperties.length - 1]
  }
})

Instance.orderBy = async function(property) {
  let instances = await this.all
  return instances.sort((a,b) => a[property] - b[property])
}

/* receives an object of attribute:value and returns
an instance(object)/instances(array of objets)
that match the attributes:values */
Instance.where = async function(properties) {
  this.validates(properties)

  let allInstances = await this.all
  Object.keys(properties).forEach((perameter) =>{
    allInstances = allInstances.filter((instance) => {
      return instance[perameter] == properties[perameter]
    })
  })
  return allInstances.length == 1 ? allInstances[0] : allInstances
}

module.exports = {Instance}
