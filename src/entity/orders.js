const db = require('../config/mongo').db

const Orders = db.model('Orders', {
    transactionHash: String,
    status: String,
    created: Date,
    user: String,
    amount: Number,
    operating: String
});

module.exports = {
    insertOne: function (transactionHash, status, created, user, amount, operating, callback) {
        const orders = new Orders({
            transactionHash: transactionHash,
            status: status,
            created: created,
            user: user,
            amount: amount,
            operating: operating
        });
        orders.save(callback);
    },
    find: function (user, page, size) {
        const options = {
            limit: size,
            skip: page * size,
            sort: {created: -1}
        };
        //Conditions,fields,options,callback
        return Orders.find({user: user}, {}, options).exec();
    },
    findCount: function (user, callback) {
        Orders.countDocuments({user: user}, callback);
    }
}