function createHandlers({ queries }) {
  return {
  };
}

function createQueries({ db }) {
  return {
  };
}

function build({ db, messageStore }) {
  const queries = createQueries({ db });
  const handlers = createHandlers({ queries });
  return {
    queries,
    handlers,
  };
}

module.exports = build