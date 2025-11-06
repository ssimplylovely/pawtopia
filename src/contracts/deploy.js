// Hardhat deployment script for Pawtopia contracts
// Usage: npx hardhat run contracts/deploy.js --network <network>

const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Pawtopia deployment...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("📋 Deployment Info:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // ============ Deploy ONEP Token ============
  console.log("1️⃣ Deploying ONEPToken (ERC-20)...");
  const ONEPToken = await hre.ethers.getContractFactory("ONEPToken");
  const onepToken = await ONEPToken.deploy();
  await onepToken.waitForDeployment();
  const onepAddress = await onepToken.getAddress();
  
  console.log("✅ ONEPToken deployed to:", onepAddress);
  console.log("   - Name: Pawtopia Token");
  console.log("   - Symbol: ONEP");
  console.log("   - Total Supply: 1,000,000,000 ONEP");
  console.log("   - Rewards Pool: 400,000,000 ONEP");
  console.log("   - Staking Pool: 200,000,000 ONEP\n");
  
  // ============ Deploy Pawtopia Core ============
  console.log("2️⃣ Deploying PawtopiaCore (ERC-721)...");
  const PawtopiaCore = await hre.ethers.getContractFactory("PawtopiaCore");
  const pawtopiaCore = await PawtopiaCore.deploy();
  await pawtopiaCore.waitForDeployment();
  const coreAddress = await pawtopiaCore.getAddress();
  
  console.log("✅ PawtopiaCore deployed to:", coreAddress);
  console.log("   - Name: Pawtopia Pet");
  console.log("   - Symbol: PAWT");
  console.log("   - Breeding Fee: 0.01 ETH");
  console.log("   - Breeding Cooldown: 24 hours");
  console.log("   - Max Breeds: 7 per pet\n");
  
  // ============ Link Contracts ============
  console.log("3️⃣ Linking contracts...");
  const authTx = await onepToken.authorizeGameContract(coreAddress);
  await authTx.wait();
  
  console.log("✅ PawtopiaCore authorized to mint ONEP rewards\n");
  
  // ============ Verification Info ============
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 Contract Addresses:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ONEPToken:     ", onepAddress);
  console.log("PawtopiaCore:  ", coreAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // ============ Verification Commands ============
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("🔍 To verify contracts on Etherscan:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`npx hardhat verify --network ${hre.network.name} ${onepAddress}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${coreAddress}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }
  
  // ============ Save Deployment Info ============
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ONEPToken: onepAddress,
      PawtopiaCore: coreAddress,
    },
    blockNumbers: {
      ONEPToken: (await onepToken.deploymentTransaction()).blockNumber,
      PawtopiaCore: (await pawtopiaCore.deploymentTransaction()).blockNumber,
    }
  };
  
  const fs = require("fs");
  const path = require("path");
  const deploymentPath = path.join(__dirname, `deployment-${hre.network.name}.json`);
  
  fs.writeFileSync(
    deploymentPath,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`💾 Deployment info saved to: ${deploymentPath}\n`);
  
  // ============ Next Steps ============
  console.log("🎉 Deployment Complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📌 Next Steps:");
  console.log("1. Verify contracts on block explorer");
  console.log("2. Update frontend with contract addresses");
  console.log("3. Test minting and breeding functions");
  console.log("4. Fund rewards pool if needed");
  console.log("5. Set up monitoring and alerts");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
