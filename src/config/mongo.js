const config = require('./config');
const mongoose = require('mongoose');


const routes=require('../controller/routes')

function connectMongoDB(app) {
    try {
        mongoose.connect(config.db, {
            useNewUrlParser: true,
            bufferMaxEntries: 0,
            autoReconnect: true,
            poolSize: 5
        })
        const db = mongoose.connection;
        db.on('error', (error) => {
            console.log(`MongoDB connecting failed: ${error}`)
        })
        db.once('open', () => {
            console.log('MongoDB connecting succeeded')
            app.listen(8080, function () {
                const host = '127.0.0.1'
                const port = this.address().port;

                console.log("API已启动，访问地址为 http://%s:%s", host, port)
            });
        })
        return db
    } catch (error) {
        console.log(`MongoDB connecting failed: ${error}`)
    }
}

const db = connectMongoDB();

module.exports = {
    db: db,
}