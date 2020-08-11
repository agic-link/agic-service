const express = require('express');
const app = express();

module.exports = function () {
    app.get('/orders', function (req, res) {
        console.log(req.application)
        res.end("success")
    });

    app.get("/", (req, res) => {
        console.log(req)
    });
}

module.exports = {
    app: app
}
