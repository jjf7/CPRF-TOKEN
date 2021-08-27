// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import './Token.sol';

contract Bank {

    address public minter;
    mapping(address => uint) public balances;
    uint public rate;

    Token public token;

    event TokenPurchased(address indexed account, address indexed token, uint amount, uint rate);

    modifier onlyMinter(){
        require(msg.sender == minter);
        _;
    }

    constructor(Token _token){
        token = _token;
        minter = msg.sender;
        rate = 100;
    }

    function setRate(uint _rate) public onlyMinter {
        rate = _rate;
    }

    function buyTokens() public payable {
        require(msg.sender != address(0));

        // 1 ether = 100 tokens

        uint tokenAmount = msg.value * rate;

        require(token.balanceOf(address(this)) >= tokenAmount);

        balances[msg.sender] += msg.value;

        token.transfer(msg.sender, tokenAmount);

        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);

    }

    function balanceOfTokens(address _address) public view returns(uint) {
        return token.balanceOf(_address);
    }

    function getName() public view returns(string memory){
        return token.name();
    }

    function getSymbol() public view returns(string memory){
        return token.symbol();
    }
}
