const config = require('../config/config')
const Web3 = require('web3')
const Orders = require('../entity/orders')
const Decimal = require('decimal.js');

const ropstenWeb3 = new Web3(new Web3.providers.WebsocketProvider(config.web3.provider("3")));
const ropstenInstance = new ropstenWeb3.eth.Contract(config.web3.abi, config.web3.address("3"));

// const mainWeb3 = new Web3(new Web3.providers.WebsocketProvider(config.web3.provider("1")));
// const mainInstance = new ropstenWeb3.eth.Contract(config.web3.abi, config.web3.address(1));

ropstenInstance.events.Deposit(function (error, event) {
    if (error) {
        console.log("Deposit:", error)
        return;
    }
    console.log("接收Deposit成功事件:", event)
}).on('data', function (event) {
    const transactionHash = event.transactionHash;
    console.log('Deposit Success：' + transactionHash)
    const eth = event.returnValues._value;
    Orders.findOneAndUpdate(config.web3.network.ropsten, transactionHash, {
        status: config.constant.status.success,
        value: eth
    });
}).on('changed', function (event) {
    console.log('Deposit changed', event)
}).on('error', function (error, receipt) {
    // 如果交易被网络拒绝并带有交易收据，第二个参数将是交易收据。
    console.log('Deposit error', error, receipt)
    const transactionHash = receipt.transactionHash;
    Orders.findOneAndUpdate(config.web3.network.ropsten, transactionHash, {status: config.constant.status.fail})
});

ropstenInstance.events.Redeem(function (error, event) {
    if (error) {
        console.log("接收Redeem事件error:", error)
        return;
    }
    console.log("接收Redeem事件:", event)
}).on('data', function (event) {
    const transactionHash = event.transactionHash;
    console.log('Redeem Success：' + transactionHash)
    const serviceCharge = event.returnValues.serviceCharge;
    const subPledgeEth = event.returnValues.subPledgeEth;
    const agicValue = event.returnValues._agic;
    Orders.findOneAndUpdate(config.web3.network.ropsten, transactionHash, {
        status: config.constant.status.success,
        agicValue: agicValue,
        subPledgeEth: subPledgeEth,
        serviceCharge: serviceCharge
    });
}).on('changed', function (event) {
    console.log('Redeem changed', event)
}).on('error', function (error, receipt) {
    // 如果交易被网络拒绝并带有交易收据，第二个参数将是交易收据。
    console.log('Redeem error', error, receipt)
    const transactionHash = receipt.transactionHash;
    Orders.findOneAndUpdate(config.web3.network.ropsten, transactionHash, {status: config.constant.status.fail})
});

ropstenInstance.events.Transfer(function (error, event) {
    if (error) {
        console.log("接收Transfer事件error:", error)
        return;
    }
    console.log("接收Transfer事件:", event)
}).on('data', function (event) {
    const transactionHash = event.transactionHash;
    console.log('Transfer Success：' + transactionHash)
    const agicValue = event.returnValues.value;
    Orders.findOneAndUpdate(config.web3.network.ropsten, transactionHash, {
        status: config.constant.status.success,
        agicValue: agicValue,
    });
}).on('changed', function (event) {
    console.log('Transfer changed', event)
}).on('error', function (error, receipt) {
    // 如果交易被网络拒绝并带有交易收据，第二个参数将是交易收据。
    console.log('Transfer error', error, receipt)
    const transactionHash = receipt.transactionHash;
    Orders.findOneAndUpdate(config.web3.network.ropsten, transactionHash, {status: config.constant.status.fail})
});

module.exports = {
    getTransaction: function (networkId, transactionHash, callback) {
        if (networkId === config.web3.network.main) {
            //mainWeb3.eth.getTransaction(transactionHash, callback);
        } else if (networkId === config.web3.network.ropsten) {
            ropstenWeb3.eth.getTransaction(transactionHash, callback);
        } else {
            throw  new Error("尚未支持networkId：" + networkId)
        }
    },
    // getTransaction: function (networkId, transactionHash, callback) {
    //     ropstenWeb3.eth.getTransaction(transactionHash, callback);
    // },
}