const hre = require("hardhat");

async function main() {
  const Stealth = await hre.ethers.getContractFactory("StealthRegistry");
  const stealth = await Stealth.deploy();
  await stealth.deployed();
  console.log("StealthRegistry deployed to:", stealth.address);
}

main().catch((err) => { console.error(err); process.exit(1); });
