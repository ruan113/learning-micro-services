const writeFunctionSql =
  'SELECT message_store.write_message($1, $2, $3, $4, $5, $6)';

function createWrite({ db }) {
  return (streamName, message, expectedVersion) => {
    if (!message.type) {
      throw new Error('Messages must have a type')
    }

    const values = [
      message.id,
      streamName,
      message.type,
      message.data,
      message.metadata,
      expectedVersion
    ];

    return db.query(writeFunctionSql, values);
  }
}

module.exports = createWrite