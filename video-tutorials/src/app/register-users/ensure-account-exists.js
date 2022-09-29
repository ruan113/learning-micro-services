const ValidationError = require('../errors/validation-error');

function ensureAccountExists(context) {
  if (context.existingIdentity) {
    return context;
  }

  throw new ValidationError({ email: ['Account does not exists!'] });
}

module.exports = ensureAccountExists;