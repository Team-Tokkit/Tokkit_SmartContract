require("dotenv").config(); // .env에서 SPRING_SERVER_URL 읽음

const hre = require("hardhat");
const { formatEther } = require("ethers");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(" Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(" Account balance:", formatEther(balance), "ETH");

  const TokkitToken = await hre.ethers.getContractFactory("TokkitToken");
  const contract = await TokkitToken.deploy();
  await contract.waitForDeployment();

  const deployedAddress = await contract.getAddress();
  console.log(" Contract deployed at:", deployedAddress);

  // JSON 생성
  const output = {
    contractAddress: deployedAddress,
    network: hre.network.name,
    updatedAt: new Date().toISOString(),
  };

  const outputPath = path.join(__dirname, "..", "contract-address.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(" Saved to contract-address.json");

  // Spring Boot 서버에 POST 전송
  const springApiUrl = process.env.SPRING_SERVER_URL;
  if (!springApiUrl) {
    console.warn(" SPRING_SERVER_URL not set. Skipping POST.");
    return;
  }

  try {
    await axios.post(`${springApiUrl}/api/contracts/address`, {
      TokkitToken: deployedAddress,
    });
    console.log(" Sent contract address to Spring server");
  } catch (err) {
    console.error(" Failed to send contract address to Spring:", err.message);
  }
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
