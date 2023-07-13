import fs from "fs";
import { task } from "hardhat/config";
import { BigNumber, Contract, ContractReceipt, ContractTransaction } from "ethers";
import { Address } from "ethers";

function loadAddresses() {
  const json = JSON.parse(fs.readFileSync("./.addresses", "utf-8"));
  const network = hre.network.name;
  const addresses = json[network];
  if (!addresses) throw new Error(`Contracts not yet deployed to ${network}`);

  return addresses;
}

async function approve(name: string, token: Contract, spender: string, amount: BigNumber) {
  const transaction: ContractTransaction = await token.approve(spender, amount);
  const receipt: ContractReceipt = await transaction.wait();
  if (!receipt.status) throw new Error(`Spending of ${name} was not approved for ${spender}`);

  console.log(`Spending of ${name} was approved for ${spender}`);
}

task("addLiquidity", "Adds liquidity for pair tokens")
  .addParam("amountA", "Amount for the first token")
  .addParam("amountB", "Amount for the second token")
  .setAction(async ({ amountA, amountB }, { ethers }) => {
    const addresses = loadAddresses();

    const Lupa = await ethers.getContractFactory("PairToken");
    const lupa: Contract = Lupa.attach(addresses["Lupa"]);

    const Pupa = await ethers.getContractFactory("PairToken");
    const pupa: Contract = Pupa.attach(addresses["Pupa"]);

    const Add_Liquidity = await ethers.getContractFactory("Add_Liquidity");
    const addLiquidity: Contract = Add_Liquidity.attach(addresses["Add_Liquidity"]);

    await Promise.all([
      approve("Lupa", lupa, addLiquidity.address, amountA),
      approve("Pupa", pupa, addLiquidity.address, amountB)
    ]);

    const transaction: ContractTransaction = await addLiquidity.addLiquidity(
      lupa.address,
      pupa.address,
      amountA,
      amountB
    );
    const receipt: ContractReceipt = await transaction.wait();

    const event = receipt.events?.find(event => event.event === "AddedLiquidity");
    if (!receipt.status) throw new Error("addLiquidity was reverted");
    if (!event) throw new Error("AddedLiquidity event was not found");

    const eTokenA: Address = event.args!["tokenA"];
    const eTokenB: Address = event.args!["tokenB"];
    const eAmountA: BigNumber = event.args!["amountA"];
    const eAmountB: BigNumber = event.args!["amountB"];
    const eCreator: Address = event.args!["creator"];
    const eLPpair: Address = event.args!["LPpair"];

    console.log(`eTokenA: ${eTokenA}`);
    console.log(`eTokenB: ${eTokenB}`);
    console.log(`eAmountA: ${eAmountA}`);
    console.log(`eAmountB: ${eAmountB}`);
    console.log(`eCreator: ${eCreator}`);
    console.log(`eLPpair: ${eLPpair}`);
  });