import { ethers } from "hardhat";
import { Contract } from "ethers";
import { expect } from "chai";

describe("Add_Liquidity", () => {
  let addLiquidity: Contract;
  let lupaToken: Contract;
  let pupaToken: Contract;

  before(async () => {
    const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const AddLiquidity = await ethers.getContractFactory("Add_Liquidity");
    addLiquidity = await AddLiquidity.deploy(factoryAddress, routerAddress);
    
    const PairToken = await ethers.getContractFactory("PairToken");
    lupaToken = await PairToken.deploy();
    pupaToken = await PairToken.deploy();

    await lupaToken.deployed();
    await pupaToken.deployed();
  });

  it("should add liquidity successfully", async () => {
    const lupaAmount = ethers.utils.parseEther("100");
    const pupaAmount = ethers.utils.parseEther("200");

    await lupaToken.approve(addLiquidity.address, lupaAmount);
    await pupaToken.approve(addLiquidity.address, pupaAmount);

    const transaction = await addLiquidity.addLiquidity(lupaToken.address, pupaToken.address, lupaAmount, pupaAmount);
    await transaction.wait();

    // Perform your assertions or additional tests here
    // For example, you can check the updated liquidity pool balance or LP tokens minted

    // Example assertion: Check the LP tokens balance of the sender
    const lpTokensBalance = await addLiquidity.balanceOf(msg.sender);
    expect(lpTokensBalance).to.be.gte(0);
  });
});