
module.exports = {
  development: {
    client: 'postgres',
    connection: 'postgresql://postgres:example@localhost:5431/postgres',
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  test: {
    client: 'postgres',
    connection: process.env.POSTGRES_CONNECTION,
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  production: {
    client: 'postgres',
    connection: {
        host: '',
        database: '',
        user: '',
        password: ''
    },    
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },
}
