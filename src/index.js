console.log("启动服务")

// const orders = require('./entity/orders');
//
// orders.insertOne("sdadsd", "1", new Date(), "j213bkj123b12kj123", 1e18, "2");
//
// orders.find("j213bkj123b12kj123");

require('./config/mongo').connect(app)