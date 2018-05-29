var OracleContract = require('./build/contracts/CMCOracle.json');
var contract = require('truffle-contract');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));

var oracleContract = contract(OracleContract);
oracleContract.setProvider(web3.currentProvider);

if (typeof oracleContract.currentProvider.sendAsync !== "function") {
  oracleContract.currentProvider.sendAsync = function() {
    return oracleContract.currentProvider.send.apply(
      oracleContract.currendProvider, arguments
    );
  };
}

web3.eth.getAccounts((err,accounts) => {
  oracleContract.deployed()
  .then((oracleInstance) => {
    const oraclePromises = [
      oracleInstance.getBTCCap(),
      oracleInstance.updateBTCCap({from: accounts[0]})
    ]

    // Map over all promises
    Promise.all(oraclePromises)
    .then((result) => {
      console.log('BTC Market Cap: ' + result[0]);
      console.log('Requesting Oracle to update CMC information...')
    })
    .catch((err) => {
      console.log(err);
    })
  })
  .catch((err) => {
    console.log(err)
  })
})
