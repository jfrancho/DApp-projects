pragma solidity ^0.4.17;

contract CMCOracle {
  address public owner;
  uint public btcMarketCap;

  event CallbackGetBTCCap(address sender);

  constructor() public {
    owner = msg.sender;
  }

  function updateBTCCap() public {
    emit CallbackGetBTCCap(msg.sender);
  }

  function setBTCCap(uint cap) public {
    require(msg.sender == owner);
    btcMarketCap = cap;
  }

  function getBTCCap() constant public returns (uint) {
    return btcMarketCap;
  }

}
