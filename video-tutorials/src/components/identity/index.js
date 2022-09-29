
const loadIdentity = require('./load-identity.js');
const writeRegisteredEvent = require('./write-registered-event.js');
const writeLockedEvent = require('./write-locked-event.js');

const ensureNotRegistered = require('./ensure-not-registered.js');
const ensureNotLocked = require('./ensure-not-locked.js');

const AlreadyRegisteredError = require('./errors/already-registered-error.js');
const AlreadyLockedError = require('./errors/already-locked-error.js');

const Bluebird = require('bluebird');

function build({ messageStore }) {
  const identityCommandHandlers =
    createIdentityCommandHandlers({ messageStore });

  const identityCommandSubscription = messageStore.createSubscription({
    streamName: 'identity:command',
    handlers: identityCommandHandlers,
    subscriberId: 'components:identity:command'
  });

  function start() {
    identityCommandSubscription.start();
  }

  return {
    identityCommandHandlers,
    start,
  };
}

function createIdentityCommandHandlers({ messageStore }) {
  return {
    Register: (command) => {
      const context = {
        messageStore: messageStore,
        command,
        identityId: command.data.userId
      };

      return Bluebird.resolve(context)
        .then(loadIdentity)
        .then(ensureNotRegistered)
        .then(writeRegisteredEvent)
        .catch(AlreadyRegisteredError, () => { });
    },
    Lock: (command) => {
      const context = {
        messageStore: messageStore,
        command,
        identityId: command.data.userId
      };

      return Bluebird.resolve(context)
        .then(loadIdentity)
        .then(ensureNotLocked)
        .then(writeLockedEvent)
        .catch(AlreadyLockedError, () => { console.log('Already locked!') });
    }
  }
}


module.exports = build