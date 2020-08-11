const development = require('./env/dev');
const production = require('./env/prod');

module.exports = {
    db: process.env.NODE_ENV === 'prod' ? production.db : development.db
}