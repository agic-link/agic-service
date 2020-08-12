const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const orders = require('../entity/orders')

app.all('/*', (req, res, next) => {
    if (!req.is('application/json')) {
        res.status(400).send("Request data type is json")
        return;
    }
    res.append('content-type', "application/json")
    next();
});

app.get('/', function (req, res) {
    res.send('This is Agic service');
});

app.get('/orders', function (req, res) {
    const user = req.body.user;
    const page = req.body.page | 0;
    const size = req.body.size | 10;
    orders.findCount(user, (err, count) => {
        orders.find(user, page, size).then((result) => {
            res.send({
                list: result,
                page: page,
                totalPage: Math.ceil(count / size),
                totalCount: count,
                size: size
            });
        });
    });
});

app.post('/orders', (req, res) => {
    const transactionHash = req.body.transactionHash;
    const status = req.body.status;
    const created = req.body.created;
    const user = req.body.user;
    const amount = req.body.amount;
    const operating = req.body.operating;
    orders.insertOne(transactionHash, status, created, user, amount, operating, (err, order) => {
        if (err) {
            console.log(err);
            res.status(500).send("Order record failed");
            return;
        }
        console.log("Order record successful: " + order._id);
        res.status(200).end();
    });
})

const server = app.listen(8080, function () {
    const host = '127.0.0.1';
    const port = server.address().port;
    console.log("Agic Service API已启动，访问地址为 http://%s:%s", host, port)
});