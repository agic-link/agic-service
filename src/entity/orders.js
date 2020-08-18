const config = require('../config/config')
const db = require('../support/mongo').db
const StringUtils = require('../util/StringUtils')
const contract = require('../support/contract')

const ordersStructure = {
    transactionHash: String,
    status: String,
    created: Date,
    from: String,
    to: String,
    value: Number,
    agicValue: Number,
    serviceCharge: Number,
    subPledgeEth: Number,
    event: String
};

const MainOrders = db.model('Orders', ordersStructure);
const RopstenOrders = db.model('RopstenOrders', ordersStructure);

function getOrders(id) {
    switch (id) {
        case '1':
            return MainOrders;
        case '3':
            return RopstenOrders;
        default:
            throw new Error('Not yet support this network');
    }
}

module.exports = {
    insertOne: function (orders, callback) {
        orders.save(callback);
    },
    insertTransaction: function (networkId, transactionHash, created, event, callback) {
        contract.getTransaction(networkId, transactionHash, (error, result) => {
            if (error) {
                console.error('Inquiry transaction Error', error)
                return;
            }
            const Orders = getOrders(networkId);
            const orders = new Orders({
                transactionHash: transactionHash,
                status: config.constant.status.pending,
                created: created,
                from: result.from,
                to: result.to,
                value: result.value,
                event: event
            });
            this.insertOne(orders, callback);
        })
    },
    insertRedeem: function (networkId, transactionHash, created, agicAmount, callback) {
        contract.getTransaction(networkId, transactionHash, (error, result) => {
            if (error) {
                console.error('Inquiry redeem Error', error)
                return;
            }
            const Orders = getOrders(networkId);
            const orders = new Orders({
                transactionHash: transactionHash,
                status: config.constant.status.pending,
                created: created,
                from: result.from,
                to: result.to,
                value: result.value,
                agicAmount: agicAmount,
                event: config.constant.events.redeem,
            });
            this.insertOne(orders, callback);
        })
    },
    find: function (networkId, user, event, page, size, callback) {
        const Orders = getOrders(networkId);
        const skip = page * size;
        const sort = {created: -1};
        const query = Orders.find().where('from').eq(user);
        if (StringUtils.isNotBlank(event)) {
            query.where('event').eq(event);
        }
        query.limit(size).skip(skip).sort(sort);
        return query.exec(callback);
    },
    findCount: function (networkId, user, event, callback) {
        const Orders = getOrders(networkId);
        let conditions;
        if (StringUtils.isNotBlank(event)) {
            conditions = {user: user, event: event};
        } else {
            conditions = {user: user};
        }
        Orders.countDocuments(conditions, callback);
    },
    findOneAndUpdate: function (networkId, transactionHash, orders) {
        const Orders = getOrders(networkId);
        Orders.findOneAndUpdate({transactionHash: transactionHash}, orders);
    }
}