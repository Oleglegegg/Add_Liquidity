// contracts/PairToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Add_Liquidity {
  address private factory;
  address private router;

  event AddedLiquidity(
    address tokenA,
    address tokenB,
    uint amountA,
    uint amountB,
    address creator,
    address LPpair
  );

  constructor(address _factory, address _router) {
    factory = _factory;
    router = _router;
  }

  function addLiquidity(address tokenA, address tokenB, uint amountA, uint amountB) external {
    transferFromSender(tokenA, amountA);
    transferFromSender(tokenB, amountB);

    approveRouter(tokenA, amountA);
    approveRouter(tokenB, amountB);

    (uint sentAmountA, uint sentAmountB,) =
      IUniswapV2Router02(router).addLiquidity(tokenA, tokenB, amountA, amountB, 1, 1, msg.sender, block.timestamp);

    address pair = IUniswapV2Factory(factory).getPair(tokenA, tokenB);
    emit AddedLiquidity(tokenA, tokenB, sentAmountA, sentAmountB, msg.sender, pair);
  }

  function transferFromSender(address token, uint amount) private {
    IERC20(token).transferFrom(msg.sender, address(this), amount);
  }

  function approveRouter(address token, uint amount) private {
    IERC20(token).approve(router, amount);
  }
}