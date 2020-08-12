const config = require('./config');
const mongoose = require('mongoose');

function connectMongoDB() {
    try {
        mongoose.connect(config.db, {
            useNewUrlParser: true,
            bufferMaxEntries: 0,
            reconnectTries: 30,
            reconnectInterval: 1000,
            autoReconnect: true,
            poolSize: 5
        })
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