// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import './Token.sol';

contract Bank {

    address public minter;
    mapping(address => uint) public balances;
    uint public rate;

    Token public token;
 
    modifier onlyMinter(){
        require(msg.sender == minter);
        _;
    }

    event TokenPurchased(address indexed account, address indexed token, uint amount, uint rate);

    event MinterHasChange(address indexed from, address indexed to);
    event Withdraw(address indexed owner, address indexed to, uint amount);

    constructor(Token _token){
        token = _token;
        minter = msg.sender;
        rate = 100;
    }

    function setRate(uint _rate) public onlyMinter {
        rate = _rate;
    }

    function changeMinterAddress(address _minter) public onlyMinter { 
        require(_minter != address(0)); 
        minter = _minter;
        emit MinterHasChange(minter, _minter);
    }

    function withdraw(address _to, uint amount) public onlyMinter {
        require(address(this).balance >= amount);
        require(_to != address(0));
        payable(_to).transfer(amount);
        emit Withdraw(address(this), _to, amount);
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
