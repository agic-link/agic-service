const config = require('./config');
const mongoose = require('mongoose');

function connectMongoDB() {
    try {
        if (process.env.NODE_ENV === 'prod') {
            const options = {
                useNewUrlParser: true,
                bufferMaxEntries: 0,
                reconnectTries: 30,
                reconnectInterval: 1000,
                autoReconnect: true,
                poolSize: 5,
                user: config.mongo.user,
                pass: config.mongo.password,
                authMechanism: 'SCRAM-SHA-1'
            };
            mongoose.connect(config.mongo.url, options);
        } else {
            mongoose.connect(config.mongo.url);
        }

        const db = mongoose.connection;
        db.on('error', (error) => {
            console.log(`MongoDB connecting failed: ${error}`)
        })
        db.once('open', () => {
            console.log('MongoDB connecting succeeded')
        })
        return db
    } catch (error) {
        console.log(`MongoDB connecting failed: ${error}`)
    }
}

const db = connectMongoDB();

module.exports = {
    db: db
}