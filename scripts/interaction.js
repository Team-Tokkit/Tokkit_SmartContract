const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [owner, user1] = await ethers.getSigners();

  // 이미 배포된 주소 (deploy.js에서 출력된 것)
  const deployedAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  // 컨트랙트 인스턴스 불러오기
  const TokkitToken = await ethers.getContractAt("TokkitToken", deployedAddress);

  // 🔹 Mint - owner만 가능
  const mintTx = await TokkitToken.mint(user1.address, ethers.parseEther("10"));
  await mintTx.wait();
  console.log("✅ Mint 완료");

  // 🔹 Transfer
  const transferTx = await TokkitToken.connect(user1).transferToken(owner.address, ethers.parseEther("5"));
  await transferTx.wait();
  console.log("✅ Transfer 완료");

  // 🔹 Burn - owner만 가능
  const burnTx = await TokkitToken.burn(user1.address, ethers.parseEther("2"));
  await burnTx.wait();
  console.log("✅ Burn 완료");

  // 🔹 Balance 조회
  const balance1 = await TokkitToken.balanceOf(user1.address);
  const balance0 = await TokkitToken.balanceOf(owner.address);
  console.log(`💰 user1 balance: ${ethers.formatEther(balance1)} TKT`);
  console.log(`💰 owner balance: ${ethers.formatEther(balance0)} TKT`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exitCode = 1;
});
