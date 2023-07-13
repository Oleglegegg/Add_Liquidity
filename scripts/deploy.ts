import { ethers, run, network } from "hardhat";
import { BigNumber } from "ethers";

const delay = async (time: number) => {
  return new Promise((resolve: any) => {
    setInterval(() => {
      resolve();
    }, time);
  });
};

async function deployPairToken(name: string, symbol: string, supply: BigNumber) {
  const PairToken = await ethers.getContractFactory("PairToken");
  const pairToken = await PairToken.deploy(name, symbol, supply);
  await pairToken.deployed();
  console.log(`${name} deployed to ${pairToken.address}`);

  console.log("Wait for delay...");
  await delay(25000); 

  console.log("Starting verify token...");
  try {
    await run("verify:verify", {
      address: pairToken.address,
      contract: "contracts/PairToken.sol:PairToken",
      constructorArguments: [name, symbol, supply.toString()],
    });
    console.log("Verify success");
  } catch (e: any) {
    console.log(e.message);
  }
}

async function main() {
  const lupaName = "Lupa";
  const lupaSymbol = "LUP";
  const lupaSupply = ethers.utils.parseUnits("9999", "ether");

  const pupaName = "Pupa";
  const pupaSymbol = "PUP";
  const pupaSupply = ethers.utils.parseUnits("1111", "ether");

  await deployPairToken(lupaName, lupaSymbol, lupaSupply);
  console.log("First token deployed");

  await delay(5000); // Задержка в 5 секунд

  await deployPairToken(pupaName, pupaSymbol, pupaSupply);
  console.log("Second token deployed");

  // await Promise.all([
  //   deployPairToken(lupaName, lupaSymbol, lupaSupply),
  //   deployPairToken(pupaName, pupaSymbol, pupaSupply),
  // ]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});