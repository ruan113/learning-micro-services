const { v4: uuid } = require('uuid');

function writeLockCommand(context) {
  const userId = context.attributes.id;
  const stream = `identity:command-${userId}`;

  const command = {
    id: uuid(),
    type: 'Lock',
    metadata: {
      traceId: context.traceId,
      userId
    },
    data: {
      email: context.attributes.email,
    }
  };

  return context.messageStore.write(stream, command);
}

module.exports = writeLockCommand;
