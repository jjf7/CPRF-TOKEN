// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20 {

    address public minter;
    uint public _decimals = 18;
    uint public _totalSupply = 1000000000 * 10 ** _decimals;

    modifier onlyMinter(){
        require(msg.sender == minter);
        _;
    }

    event MinterHasChange(address indexed from, address indexed to);

    constructor() ERC20("CoinPinverPhoenix","CPRP") {
        minter = msg.sender;
        mint(msg.sender, _totalSupply);
    }

    function changeMinterAddress (address _minter) public onlyMinter { 
        require(_minter != address(0)); 
        minter = _minter;
        emit MinterHasChange(minter, _minter);
    }

    function mint(address receiver, uint amount) public onlyMinter {
        _mint(receiver, amount);
    }
}
