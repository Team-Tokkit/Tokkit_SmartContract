require("dotenv").config(); // .env 파일에서 SPRING_RESOURCE_PATH 읽기

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

  // JSON 생성
  const output = {
    contractAddress: deployedAddress,
    network: hre.network.name,
    updatedAt: new Date().toISOString(),
  };

  const outputPath = path.join(__dirname, "..", "contract-address.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log("📝 Saved to contract-address.json");

  // Spring Boot로 복사
  const springPath = process.env.SPRING_RESOURCE_PATH;
  if (!springPath) {
    console.warn("⚠️ SPRING_RESOURCE_PATH not set. Skipping copy.");
    return;
  }

  const resolvedPath = path.resolve(__dirname, "..", springPath);
  fs.copyFileSync(outputPath, resolvedPath);
  console.log(`📁 Copied to Spring Boot: ${resolvedPath}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
