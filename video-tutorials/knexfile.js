/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: process.env.POSTGRES_DB || 'knex-pg-db',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      port: process.env.POSTGRES_PORT || 5432,
      host: process.env.POSTGRES_HOST || 'localhost'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/migrations',
    },
  },
};
