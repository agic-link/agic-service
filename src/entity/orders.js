const config = require('../config/config')
const Mongo = require('../support/mongo');
const StringUtils = require('../util/StringUtils')
const contract = require('../support/contract')

let db;

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

module.exports = {
    insertOne: function (orders, callback) {
        orders.save(callback);
    },
    insertDeposit: function (networkId, transactionHash, created, callback) {
        contract.getTransaction(networkId, transactionHash, (error, result) => {
            if (error) {
                console.error('Inquiry transaction Error', error)
                return;
            }
            console.log("Deposit订单查询结果：", result)
            const Orders = this.getDb().model('KovanOrders', ordersStructure, 'KovanOrders');
            const orders = new Orders({
                transactionHash: transactionHash,
                status: config.constant.status.pending,
                created: created,
                from: result.from.toUpperCase(),
                to: result.to,
                value: result.value,
                agicValue: result.value * 4,
                event: config.constant.events.deposit,
            });
            this.insertOne(orders, callback);
        })
    },

    insertRedeem: function (networkId, transactionHash, created, eth, agicValue, callback) {
        contract.getTransaction(networkId, transactionHash, (error, result) => {
            if (error) {
                console.error('Inquiry redeem Error', error)
                return;
            }
            const Orders = this.getDb().model('KovanOrders', ordersStructure, 'KovanOrders');
            const orders = new Orders({
                transactionHash: transactionHash,
                status: config.constant.status.pending,
                created: created,
                from: result.from.toUpperCase(),
                to: result.to.toUpperCase(),
                value: eth,
                agicValue: agicValue,
                event: config.constant.events.redeem,
            });
            this.insertOne(orders, callback);
        })
    },
    find: function (network, user, event, page, size, callback) {
        const Orders = this.getDb().model('KovanOrders', ordersStructure, 'KovanOrders');
        const skip = page * size;
        const sort = {created: -1};
        let query = Orders.find({from: user});
        query.collection(Orders.collection);
        if (StringUtils.isNotBlank(event)) {
            query.where('event').equals(event);
        }
        query.limit(size).skip(skip).sort(sort);
        return query.exec(callback);
    },
    findCount: function (network, user, event, callback) {
        const Orders = this.getDb().model('KovanOrders', ordersStructure, 'KovanOrders');
        let conditions;
        if (StringUtils.isNotBlank(event)) {
            conditions = {from: user, event: event};
        } else {
            conditions = {from: user};
        }
        Orders.countDocuments(conditions, callback);
    },
    findOneAndUpdate: function (networkId, transactionHash, orders) {
        const Orders = this.getDb().model('KovanOrders', ordersStructure, 'KovanOrders');
        Orders.findOneAndUpdate({transactionHash: transactionHash}, orders);
    },
    getDb: function () {
        if (db === undefined) {
            db = Mongo.getDb();
        }
        return db;
    }
}
