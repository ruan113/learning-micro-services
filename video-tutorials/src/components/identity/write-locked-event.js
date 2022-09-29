const { v4: uuid } = require('uuid');

function writeLockedEvent(context, err) {
  const command = context.command;

  const lockedEvent = {
    id: uuid(),
    type: 'Locked',
    metadata: {
      traceId: command.metadata.traceId,
      userId: command.metadata.userId
    },
    data: {
      userId: command.data.userId,
      email: command.data.email,
      passwordHash: command.data.passwordHash
    }
  };

  const identityStreamName = `identity-${command.data.userId}`;

  return context.messageStore
    .write(identityStreamName, lockedEvent)
    .then(() => context);
}

module.exports = writeLockedEvent;
