// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokkitToken is ERC20, Ownable {

    event PaymentEvent(
        address indexed from,
        address indexed to,
        uint256 amount,
        string purpose,
        uint256 timestamp
    );

    constructor() ERC20("TokkitToken", "TKT") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function payToMerchant(address merchant, uint256 amount, string memory purpose) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, merchant, amount);
        emit PaymentEvent(msg.sender, merchant, amount, purpose, block.timestamp);
    }

    function transferToken(address to, uint256 amount) public {
        _transfer(msg.sender, to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner {
        require(balanceOf(from) >= amount, "Insufficient balance");
        _burn(from, amount);
    }
}
