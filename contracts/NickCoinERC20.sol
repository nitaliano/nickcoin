pragma solidity ^0.6.0;

import "./interfaces/IERC20.sol";
import "./libraries/SafeMath.sol";

contract NickCoinERC20 is IERC20 {

  string public constant name = "NickCoin";
  string public constant symbol = "NIC";

  uint8 public constant decimals = 18;

  event Approval(address indexed tokenOwner, address indexed spender, uint value);
  event Transfer(address indexed from, address indexed to, uint tokens);

  mapping(address => uint256) balances;
  mapping(address => mapping (address => uint256)) allowed;

  uint256 totalSupply_;

  using SafeMath for uint256;

  constructor(uint256 total) public {
    totalSupply_ = total;
    balances[msg.sender] = totalSupply_;
  }

  function totalSupply() public override view returns (uint256) {
    return totalSupply_;
  }

  function balanceOf(address tokenOwner) public override view returns (uint256) {
    return balances[tokenOwner];
  }

  function allowance(address owner, address delegate) public override view returns (uint256) {
    return allowed[owner][delegate];
  }

  function transfer(address recipient, uint256 amount) public override returns (bool) {
    require(amount <= balances[msg.sender]);

    balances[msg.sender] = balances[msg.sender].sub(amount);
    balances[recipient] = balances[recipient].add(amount);
    emit Transfer(msg.sender, recipient, amount);

    return true;
  }

  function approve(address delegate, uint256 amount) public override returns (bool) {
    allowed[msg.sender][delegate] = amount;
    emit Approval(msg.sender, delegate, amount);

    return true;
  }

  function transferFrom(address owner, address recipient, uint256 amount) public override returns (bool) {
    require(amount <= balances[owner]);
    require(amount <= allowed[owner][msg.sender]);

    balances[owner] = balances[owner].sub(amount);
    balances[recipient] = balances[recipient].add(amount);
    allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(amount);
    emit Transfer(owner, recipient, amount);

    return true;
  }
}