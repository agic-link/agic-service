const config = require('../config/config');
const mongoose = require('mongoose');
const tunnel = require('tunnel-ssh');

let db;

const sshConfig = {
    host: config.mongo.host,
    username: 'root',
    password: config.mongo.hostPassword,
    dstPort: config.mongo.port,
};

tunnel(sshConfig, (error, server) => {
    if (error) {
        console.log("SSH connection error: " + error);
        return;
    }
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferMaxEntries: 0,
            poolSize: 5,
            user: config.mongo.user,
            pass: config.mongo.password,
            authSource: config.mongo.source,
            authMechanism: 'SCRAM-SHA-1',
        };
        mongoose.connect("mongodb://localhost:" + config.mongo.port + "/" + config.mongo.source, options);
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
});

module.exports = {
    getDb() {
        return db;
    }
}
