//SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import {IERC20} from "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
contract erc20token is IERC20 {

    string public constant name = "Talha Ahmed Siddiqui";
    string public constant symbol = "TAS";
    uint8 public constant decimals = 18;
    uint256 totalSupply_;
    address owner; 

    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;

    constructor(uint256 total) {
    totalSupply_ = total;
    balances[msg.sender] = totalSupply_;
    owner = msg.sender;
}

    function totalSupply() public view override returns(uint){
        return totalSupply_;
    }

    function balanceOf(address tokenOwner) public view override returns (uint) {
    return balances[tokenOwner];
}
    function transfer(address receiver, uint numTokens) public override returns (bool) {
    require(numTokens <= balances[owner]);
    balances[owner] -= numTokens;
    balances[receiver] += numTokens;
    emit Transfer(msg.sender, receiver, numTokens);
    return true;
}

    function approve(address delegate, uint numTokens) public override returns (bool) {
    allowed[msg.sender][delegate] = numTokens;
    emit Approval(msg.sender, delegate, numTokens);
    return true;
}

    function allowance(address _owner, address delegate) public view override returns (uint) {
    return allowed[_owner][delegate];
}


    function transferFrom(address _owner, address buyer, uint numTokens) public override returns (bool) {
    require(numTokens <= balances[_owner]);
    require(numTokens <= allowed[_owner][msg.sender]);
    balances[_owner] -= numTokens;
    allowed[_owner][msg.sender] -= numTokens;
    balances[buyer] += numTokens;
    emit Transfer(_owner, buyer, numTokens);
    return true;
}



}