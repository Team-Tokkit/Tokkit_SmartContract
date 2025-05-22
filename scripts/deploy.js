const hre = require("hardhat");
const { formatEther } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("📦 Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", formatEther(balance), "ETH");

  const TokkitToken = await hre.ethers.getContractFactory("TokkitToken");
  const contract = await TokkitToken.deploy();
  await contract.waitForDeployment();

  const deployedAddress = await contract.getAddress();
  console.log("✅ Contract deployed at:", deployedAddress);

  // 🔽 배포 주소를 JSON 파일로 저장
  const savePath = path.join(__dirname, "../contract-address.json");
  const output = {
    contractAddress: deployedAddress,
    network: hre.network.name,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(savePath, JSON.stringify(output, null, 2));
  console.log(`📝 Saved deployed address to ${savePath}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
