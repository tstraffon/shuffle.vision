const env = process.env.NODE_ENV || 'development';
const { Client } = require('pg');

const pg = new Client({
    connectionString: require('../knexfile')[env].connection,
});

const knex = require('knex')(require('../knexfile')[env]);

module.exports = {
    pg,
    knex,
};