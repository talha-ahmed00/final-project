//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract researchplus {

    IERC20 TASToken = IERC20(0x24f915F25Ad6888c70adf3e567d0c9dc812FAacB);

    event NewSubmission(
        address indexed from,
        uint256 timestamp,
        string name,
        string discord
    );

    struct FormSubmission{
        address from;
        uint256 timestamp;
        string name;
        string discord;


    }

    FormSubmission[] submissions;

    address payable owner;

    constructor(){
        owner = payable(msg.sender);
    }


    function SubmitForm(string memory _name, string memory _discord) public payable{
        
        submissions.push(FormSubmission(
            msg.sender,
            block.timestamp,
            _name,
            _discord
        ));


        emit NewSubmission(
            msg.sender,
            block.timestamp,
            _name,
            _discord
        );

        TASToken.transfer(msg.sender, 1);

    }


    function getSubmissions() public view returns(FormSubmission[] memory){
        
        require(msg.sender == owner);
        return submissions;
    }
   
}
