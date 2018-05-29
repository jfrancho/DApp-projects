var fetch = require('fetch');
var OracleContract = require('./build/contracts/CMCOracle.json');
var contract = require('truffle-contract');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));

var oracleContract = contract(OracleContract);
oracleContract.setProvider(web3.currentProvider);

if (typeof oracleContract.currentProvider.sendAsync !== "function") {
  oracleContract.currentProvider.sendAsync = function() {
    return oracleContract.currentProvider.send.apply(
      oracleContract.currentProvider, arguments
    );
  };
}

web3.eth.getAccounts((err, accounts) => {
  oracleContract.deployed()
  .then((oracleInstance) => {
    oracleInstance.CallbackGetBTCCap()
    .watch((err, event) => {
      fetch.fetchUrl('https://api.coinmarketcap.com/v1/global/', (err, m, b) => {
        const cmcJson = JSON.parse(b.toString())
        const btcMarketCap = parseInt(cmcJson.total_market_cap_usd)

        oracleInstance.setBTCCap(btcMarketCap, {from: accounts[0]});
      })
    })
  })
  .catch((err) => {
    console.log(err);
  })
})
