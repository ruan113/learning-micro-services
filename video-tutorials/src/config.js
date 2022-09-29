const createKnexClient = require('./knex-client');
const createHomeApp = require('./app/home');
const createRecordViewingsApp = require('./app/record-viewings');

const createPostgresClient = require('./postgres-client');
const createMessageStore = require('./message-store');

const createHomePageAggregator = require('./aggregators/home-page')
const createUserCredentialsAggregator = require('./aggregators/user_credentials')

const createRegisterUsersApp = require('./app/register-users')

const createIdentityComponent = require('./components/identity')

function createConfig({ env }) {
  const knexClient = createKnexClient({ env });
  const postgresClient = createPostgresClient({
    connectionString: env.messageStoreConnectionString
  });
  const messageStore = createMessageStore({ db: postgresClient });
  const homeApp = createHomeApp({ db: knexClient });
  const recordViewingsApp = createRecordViewingsApp({ messageStore });

  const registerUsersApp = createRegisterUsersApp({
    db: knexClient,
    messageStore
  });

  const homePageAggregator = createHomePageAggregator({
    db: knexClient,
    messageStore
  });

  const userCredentialsAggregator = createUserCredentialsAggregator({
    db: knexClient,
    messageStore
  });

  const aggregators = [
    homePageAggregator,
    userCredentialsAggregator,
  ];

  const identityComponent = createIdentityComponent({ messageStore });

  const components = [
    identityComponent,
  ];


  return {
    env,
    db: knexClient,
    homeApp,
    recordViewingsApp,
    messageStore,
    homePageAggregator,
    aggregators,
    components,
    registerUsersApp,
    identityComponent,
  };
}

module.exports = createConfig;
