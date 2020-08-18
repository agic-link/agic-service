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

app.get('/', (req, res) => {
    res.send('This is Agic service');
});

app.get('/transaction', (req, res) => {
    const user = req.body.user;
    const page = req.body.page | 0;
    const size = req.body.size | 10;
    const event = req.body.event;
    const networkId = req.body.networkId;
    orders.findCount(networkId, user, event, (err, count) => {
        orders.find(user, event, page, size, (result) => {
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

app.post('/transaction', (req, res) => {
    const transactionHash = req.body.transactionHash;
    const created = req.body.created;
    const event = req.body.event;
    const networkId = req.body.networkId;
    orders.insertTransaction(networkId, transactionHash, created, event, (err, order) => {
        if (err) {
            console.log(err);
            res.status(500).send("Order record failed");
            return;
        }
        console.log("Order record successful: " + order._id);
        res.status(200).end();
    });
})

app.post('/redeem', (req, res) => {
    const transactionHash = req.body.transactionHash;
    const created = req.body.created;
    const agicAmount = req.body.agicAmount;
    const networkId = req.body.networkId;
    orders.insertRedeem(networkId, transactionHash, created, agicAmount, (err, order) => {
        if (err) {
            console.log(err);
            res.status(500).send("Order record failed");
            return;
        }
        console.log("Order record successful: " + order._id);
        res.status(200).end();
    });
})

const server = app.listen(8080, (ss) => {
    const host = '127.0.0.1';
    const port = server.address().port;
    console.log("Agic Service API已启动，访问地址为 http://%s:%s", host, port)
});