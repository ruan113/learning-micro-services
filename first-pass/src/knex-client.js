const Bluebird = require('bluebird')
const knex = require('knex')

function createKnexClient ({ env }) { 
  const config = require('../knexfile')[env.env]
  const client = knex(config) 

  const migrationOptions = { 
    tableName: config.migrations.tableName || 'knex_migrations'
  }

  // Wrap in Bluebird.resolve to guarantee a Bluebird Promise down the chain
  return Bluebird.resolve(client.migrate.latest(migrationOptions)) 
    .then(() => client)
}

module.exports = createKnexClient