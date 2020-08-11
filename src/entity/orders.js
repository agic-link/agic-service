const db = require('../config/mongo').db

console.log(db);

const Orders = db.model('Orders', {
    transactionHash: String,
    status: String,
    created: Date,
    user: String,
    amount: Number,
    operating: String
});

module.exports = {
    insertOne: function (transactionHash, status, created, user, amount, operating) {
        const orders = new Orders({
            transactionHash: transactionHash,
            status: status,
            created: created,
            user: user,
            amount: amount,
            operating: operating
        });
        orders.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('success');
            }
        });
    },
    find: function (user, page, size) {
        const options = {
            limit: size | 10,
            skip: page == null ? 0 : page * size
        };
        //Conditions,fields,options,callback
        Orders.find({user: user}, {}, options, (error, docs) => {
            if (error) {
                console.log("error :" + error);
            } else {
                console.log(docs); //docs: age为6的所有文档
            }
        });
    }
}