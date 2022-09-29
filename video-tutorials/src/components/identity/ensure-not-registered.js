const AlreadyRegisteredError = require('./errors/already-registered-error');

function ensureNotRegistered(context) {
  if (context.identity.isRegistered) {
    throw new AlreadyRegisteredError();
  }

  return context;
}

module.exports = ensureNotRegistered;
