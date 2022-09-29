
const loadIdentity = required('./load-identity.js');
const writeRegisteredEvent = required('./write-registered-event.js');
const ensureNotRegistered = required('./ensure-not-registered.js');
const AlreadyRegisteredError = required('./errors/already-registered-error.js');
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
  }
}


module.exports = build