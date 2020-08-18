const config = require('./config')
const Web3 = require('web3')
const Orders = require('../entity/orders')

const ropstenWeb3 = new Web3(new Web3.providers.WebsocketProvider(config.web3.provider));
const ropstenInstance = new ropstenWeb3.eth.Contract(config.web3.abi, config.web3.address);

ropstenInstance.events.Deposit(function (error, event) {
    if (error) {
        console.log("Deposit:", error)
    }
    console.log("接收Deposit成功事件:", event)
}).on('data', function (event) {
    const transactionHash = event.transactionHash;
    console.log('Deposit Success：' + transactionHash)
    Orders.findOneAndUpdate(transactionHash, {status: config.constant.status.success})
}).on('changed', function (event) {
    console.log('Deposit changed', event)
}).on('error', function (error, receipt) {
    // 如果交易被网络拒绝并带有交易收据，第二个参数将是交易收据。
    console.log('Deposit error', error, receipt)
    const transactionHash = receipt.transactionHash;
    Orders.findOneAndUpdate(transactionHash, {status: config.constant.status.fail})
});

ropstenInstance.events.Redeem(function (error, event) {
    if (error) {
        console.log("接收Redeem事件error:", error)
    }
    console.log("接收Redeem事件:", event)
}).on('data', function (event) {
    const transactionHash = event.transactionHash;
    console.log('Redeem Success：' + transactionHash)
    Orders.findOneAndUpdate(transactionHash, {status: config.constant.status.success})
}).on('changed', function (event) {
    console.log('Redeem changed', event)
}).on('error', function (error, receipt) {
    // 如果交易被网络拒绝并带有交易收据，第二个参数将是交易收据。
    console.log('Deposit error', error, receipt)
    const transactionHash = receipt.transactionHash;
    Orders.findOneAndUpdate(transactionHash, {status: config.constant.status.fail})
});