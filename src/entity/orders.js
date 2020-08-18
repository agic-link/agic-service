const config = require('../config/config')
const db = require('../config/mongo').db
const StringUtils = require('../uitl/StringUtils')

const ordersStructure = {
    transactionHash: String,
    status: String,
    created: Date,
    from: String,
    to: String,
    amount: Number,
    serviceCharge: Number,
    subPledgeEth: Number,
    event: String
};

const MainOrders = db.model('Orders', ordersStructure);
const RopstenOrders = db.model('RopstenOrders', ordersStructure);

const Orders = config.web3.chainNet ? MainOrders : RopstenOrders;

module.exports = {
    insertOne: function (orders, callback) {
        orders.save(callback);
    },
    insertTransaction: function (transactionHash, status, created, from, to, amount, event, callback) {
        const orders = new Orders({
            transactionHash: transactionHash,
            status: status,
            created: created,
            from: from,
            to: to,
            amount: amount,
            event: event
        });
        this.insertOne(orders, callback);
    },
    insertRedeem: function (transactionHash, created, from, amount, serviceCharge, subPledgeEth, callback) {
        const orders = new Orders({
            transactionHash: transactionHash,
            status: config.constant.status.pending,
            created: created,
            from: from,
            to: config.web3.address,
            amount: amount,
            event: config.constant.events.redeem,
            serviceCharge: serviceCharge,
            subPledgeEth: subPledgeEth
        });
        this.insertOne(orders, callback);
    },
    find: function (user, event, page, size, callback) {
        const skip = page * size;
        const sort = {created: -1};
        const query = Orders.find().where('from').eq(user);
        if (StringUtils.isNotBlank(event)) {
            query.where('event').eq(event);
        }
        query.limit(size).skip(skip).sort(sort);
        return query.exec(callback);
    },
    findCount: function (user, event, callback) {
        let conditions;
        if (StringUtils.isNotBlank(event)) {
            conditions = {user: user, event: event};
        } else {
            conditions = {user: user};
        }
        Orders.countDocuments(conditions, callback);
    },
    findOneAndUpdate: function (transactionHash, orders) {
        Orders.findOneAndUpdate({transactionHash: transactionHash}, orders);
    }
}