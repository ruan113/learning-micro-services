const validate = require('validate.js')

const ValidationError = require('../errors/validation-error')

const constraints = {
  email: {
    email: true,
    presence: true
  },
  password: {
    length: { minimum: 8 },
    presence: true
  }
}

function v(context) {
  const constraintsAux = Object.keys(context.attributes).reduce((acc, it) => {
    if (constraints[it]) {
      acc[it] = constraints[it];
    }
    return acc;
  }, {});

  const validationErrors = validate(context.attributes, constraintsAux);

  if (validationErrors) {
    throw new ValidationError(validationErrors)
  }

  return context
}

module.exports = v