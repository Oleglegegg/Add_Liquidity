import { ethers } from "hardhat";

async function main() {
  const Add_Liquidity = await ethers.getContractFactory("Add_Liquidity")
  const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
  const add_liquidity = await Add_Liquidity.deploy(factoryAddress, routerAddress)
  await add_liquidity.deployed()
  console.log(`Add_Liquidity deployed to ${add_liquidity.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});