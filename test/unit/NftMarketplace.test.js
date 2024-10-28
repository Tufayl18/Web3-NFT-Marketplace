// const { assert, expect } = require("chai")
const { expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")
const { getNamedAccounts, deployments, ethers } = require("hardhat")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFTMarketplace tests", function () {
          let nftMarketplace, basicNft, deployer, player
          const PRICE = ethers.parseEther("0.1")
          const TOKEN_ID = 0

          beforeEach(async () => {
              //   deployer = (await getNamedAccounts()).deployer
              //player = (await getNamedAccounts()).player
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              player = accounts[1]
              await deployments.fixture(["all"])

              const nftContract = await deployments.get("NftMarketplace")
              const basicContract = await deployments.get("BasicNft")

              nftMarketplace = await ethers.getContractAt(
                  nftContract.abi,
                  nftContract.address,
              )
              nftMarketplace = nftMarketplace.connect(deployer)

              basicNft = await ethers.getContractAt(
                  basicContract.abi,
                  basicContract.address,
              )
              basicNft = basicNft.connect(deployer)

              await basicNft.safeMint()
              await basicNft.approve(nftMarketplace.target, TOKEN_ID)
          })

          describe("listItem", () => {
              it("reverts if price is zero", async () => {
                  const zero = ethers.parseEther("0")
                  await expect(
                      nftMarketplace.listItem(basicNft.target, TOKEN_ID, zero),
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__PriceMustBeAboveZero",
                  )
              })
          })
      })
