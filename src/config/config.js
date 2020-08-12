const development = require('./env/dev');
const production = require('./env/prod');

module.exports = {
    mongo: {
        url: process.env.NODE_ENV === 'prod' ? production.mongo.url : development.mongo.url,
        user: process.env.NODE_ENV === 'prod' ? production.mongo.user : development.mongo.user,
        password: process.env.NODE_ENV === 'prod' ? production.mongo.password : development.mongo.password,
    }
}