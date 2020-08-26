const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const orders = require('../entity/orders')

app.all('/*', (req, res, next) => {
    if (req.method !== 'GET') {
        if (!req.is('application/json')) {
            res.status(400).send("Request data type is json")
            return;
        }
    }
    res.append('content-type', "application/json")
    next();
});

app.get('/', (req, res) => {
    res.send('This is Agic service');
});

app.get('/orders', (req, res) => {
    const user = req.query.user;
    const page = req.query.page | 0;
    const size = req.query.size | 10;
    const event = req.query.event;
    const network = req.query.network.toString();
    orders.findCount(network, user, event, (err, count) => {
        if (err) {
            console.log(err);
            res.status(500).send("Order record failed");
            return;
        }
        orders.find(network, user, event, page, size, (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send("Order record failed");
                return;
            }
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

app.post('/deposit', (req, res) => {
    const transactionHash = req.body.transactionHash;
    const created = req.body.created;
    const networkId = req.body.networkId;
    orders.insertDeposit(networkId, transactionHash, created, (err, order) => {
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
    const eth = req.body.eth;
    const networkId = req.body.networkId;
    orders.insertRedeem(networkId, transactionHash, created, eth, agicAmount, (err, order) => {
        if (err) {
            console.log(err);
            res.status(500).send("Order record failed");
            return;
        }
        console.log("Order record successful: " + order._id);
        res.status(200).end();
    });
})

const server = app.listen(8081, (ss) => {
    const host = '127.0.0.1';
    const port = server.address().port;
    console.log("Agic Service API已启动，访问地址为 http://%s:%s", host, port)
});