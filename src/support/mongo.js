const config = require('../config/config');
const mongoose = require('mongoose');

let db;

try {
    let options;
    if (process.env.NODE_ENV === 'prod') {
        options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferMaxEntries: 0,
            reconnectTries: 30,
            reconnectInterval: 1000,
            autoReconnect: true,
            poolSize: 5,
            user: config.mongo.user,
            pass: config.mongo.password,
            authMechanism: 'SCRAM-SHA-1'
        };
    } else {
        options = {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    }
    mongoose.connect(config.mongo.url, options);
    db = mongoose.connection;
    db.on('error', (error) => {
        console.log(`MongoDB connecting failed: ${error}`)
    })
    db.once('open', () => {
        console.log('MongoDB connecting succeeded')
    })
} catch (error) {
    console.log(`MongoDB connecting failed: ${error}`)
}

module.exports = {
    db: db
}