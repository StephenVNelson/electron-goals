const {Database} = require('./db.js')

const Validate = Object.create(Database)

Validate.validates = function(object){
  Object.keys(object).forEach((property) => {
    if (!this.VALID_ATTRIBUTES.includes(property)) {
      throw new Error(`${property} is not a valid property`);
    }
    if (object[property] == "") {
      throw new Error(`${property} must contain a value`);
    }
  })
}

module.exports = {Validate}
