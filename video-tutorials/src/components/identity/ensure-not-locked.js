const AlreadyLockedError = require('./errors/already-locked-error');

function ensureNotLocked(context) {
  if (context.identity.lockedTime) {
    throw new AlreadyLockedError();
  }

  return context;
}

module.exports = ensureNotLocked;
