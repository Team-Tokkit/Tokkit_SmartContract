const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokkitToken", function () {
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const TokkitToken = await ethers.getContractFactory("TokkitToken");
    token = await TokkitToken.deploy();
    await token.waitForDeployment(); // v6+용
  });

  it("✅ 배포자가 owner 여야 함", async function () {
    expect(await token.owner()).to.equal(owner.address);
  });

  it("✅ owner가 mint 가능", async function () {
    await token.mint(addr1.address, 100);
    expect(await token.balanceOf(addr1.address)).to.equal(100);
  });

  it("❌ owner가 아닌 사용자는 mint 불가", async function () {
    await expect(token.connect(addr1).mint(addr2.address, 100))
      .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
      .withArgs(addr1.address);
  });

  it("✅ transfer 가능해야 함", async function () {
    await token.mint(owner.address, 100);
    await token.transfer(addr1.address, 50);
    expect(await token.balanceOf(addr1.address)).to.equal(50);
  });

  it("✅ owner가 burn 가능", async function () {
    await token.mint(addr1.address, 100);
    await token.burn(addr1.address, 50);
    expect(await token.balanceOf(addr1.address)).to.equal(50);
  });

  it("❌ owner가 아닌 사용자는 burn 불가", async function () {
    await token.mint(addr1.address, 100);
    await expect(token.connect(addr1).burn(addr1.address, 50))
      .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
      .withArgs(addr1.address);
  });
});
