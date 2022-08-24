// Primitives
const createKnexClient = require('./knex-client');
const createHomeApp = require('./app/home');

// const createRecordViewingsApp = require('./app/record-viewings');

function createConfig({ env }) {
  const homeApp = createHomeApp({ db });

  // const recordViewingsApp = createRecordViewingsApp({ db });

  return { 
    env,
    db,
    homeApp,
   };
}

module.exports = createConfig;
