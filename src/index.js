console.log("启动服务")

require('./controller/routes')

require("./support/contract");

process.on('uncaughtException', function (err) {
    console.error('Caught exception: ', err);
});