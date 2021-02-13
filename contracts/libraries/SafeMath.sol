pragma solidity ^0.6.0;

// Referenced: https://github.com/dapphub/ds-math

library SafeMath {
  function sub(uint256 x, uint256 y)  internal pure returns (uint256) {
    uint256 z = x - y;
    assert(z <= x);
    return z;
  }

  function add(uint256 x, uint256 y) internal pure returns (uint256) {
    uint256 z = x + y;
    assert(z >= x);
    return z;
  }
}
