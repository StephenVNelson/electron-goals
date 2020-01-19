const {Database} = require('./db.js')

const Validate = Object.create(Database)

Validate.validProperty = function(property){
  let validProperties = Object.keys(this.ATTRIBUTES)
  if (!validProperties.includes(property)) {
    throw new Error(`${property} is not a valid property`);
  }
}

Validate.validPresence = function(key, value){
  if (value === "") {
    if (this.ATTRIBUTES[key].presence === true){
      throw new Error(`${key} must contain a value`);
    }
  }
}

Validate.validates = function(object){
  Object.keys(object).forEach((property) => {
    this.validProperty(property)
    this.validPresence(property, object[property])
  })
}

Validate.attrByProperty = function(attribute, boolean){
  let filteredAttrs = []
  let allAttrs = this.ATTRIBUTES
  for (let k in allAttrs) {
    if (allAttrs[k][attribute] === boolean) {
      filteredAttrs.push(k)
    }
  }
  return filteredAttrs
}

module.exports = {Validate}
