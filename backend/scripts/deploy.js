const hre = require("hardhat");

async function main() {
  console.log("Deploying P2PLending contract...");

  const P2PLending = await hre.ethers.getContractFactory("P2PLending");
  const p2pLending = await P2PLending.deploy();

  await p2pLending.waitForDeployment();

  const address = await p2pLending.getAddress();
  console.log("P2PLending deployed to:", address);
  console.log("\nUpdate your .env file with:");
  console.log(`CONTRACT_ADDRESS=${address}`);
  
  // Verify contract on Etherscan (optional)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await p2pLending.deploymentTransaction().wait(6);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Error verifying contract:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
