const pgp = require('pg-promise')();

const db = pgp({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 54321,
    database: 'blog'
});

module.exports = db;