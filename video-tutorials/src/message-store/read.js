
const deserializeMessage = require('./deserialize-message')

const getLastMessageSql = 'SELECT * FROM get_last_stream_message($1)';
const getCategoryMessagesSql = 'SELECT * FROM get_category_messages($1, $2, $3)';
const getStreamMessagesSql = 'SELECT * FROM get_stream_messages($1, $2, $3)';

function createRead({ db }) {
  function fetch(streamName, projection) {
    return read(streamName).then(messages => project(messages, projection))
  }

  function readLastMessage(streamName) {
    return db.query(getLastMessageSql, [streamName])
      .then(res => deserializeMessage(res.rows[0]))
  }

  function read(streamName, fromPosition = 0, maxMessages = 1000) {
    let query = null // <callout id="co.messageStore.read.bookkeeping />
    let values = []
    if (streamName.includes('-')) {
      // Entity streams have a dash
      query = getStreamMessagesSql
      values = [streamName, fromPosition, maxMessages]
    } else {
      // Category streams do not have a dash
      query = getCategoryMessagesSql
      values = [streamName, fromPosition, maxMessages]
    }
    return db.query(query, values)
      .then(res => res.rows.map(deserializeMessage))
  }

  function project(events, projection) {
    return events.reduce((entity, event) => {
      if (!projection[event.type]) {
        return entity;
      }

      return projection[event.type](entity, event);
    }, projection.$init());
  }

  return {
    read,
    readLastMessage,
    fetch,
  }
}

module.exports = exports = createRead;