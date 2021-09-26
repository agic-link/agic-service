console.log("启动服务")

require('./controller/routes')

require("./support/contract");

process.on('uncaughtException', function (err) {
    throw err;
});

process.on('WebSocketEvent', function (err) {
    console.log('WebSocketEvent', err)
    if (err.code === 1011) {
        throw err;
    }
});
