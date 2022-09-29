function createHandlers({ queries }) {
  return {
    Registered: event => queries.createUserCredential(
      event.data.userId,
      event.data.email,
      event.data.passwordHash
    ),
    Locked: event => queries.lockUserAccount(event.data.email),
  };
}

function createQueries({ db }) {
  function createUserCredential(id, email, passwordHash) {
    const rawQuery = `
      INSERT INTO
        user_credentials (id, email, password_hash)
      VALUES
        (:id, :email, :passwordHash)
      ON CONFLICT DO NOTHING
    `

    return db.then(client =>
      client.raw(rawQuery, { id, email, passwordHash }))
  }

  function lockUserAccount(email) {
    const queryString = `
        UPDATE
          user_credentials
        SET
          locked_time = :lockedTime
        WHERE
          email = :email
      `
    return db.then(client => client.raw(queryString, { email, lockedTime: new Date() }))
  }

  return {
    createUserCredential,
    lockUserAccount,
  };
}

function build({ db, messageStore }) {
  const queries = createQueries({ db })
  const handlers = createHandlers({ queries })
  const subscription = messageStore.createSubscription({
    streamName: 'identity',
    handlers,
    subscriberId: 'aggregators:user-credentials'
  })

  function start() {
    subscription.start()
  }

  return {
    queries,
    handlers,
    start
  }
}


module.exports = build