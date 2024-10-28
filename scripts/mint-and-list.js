const mintAndList = async () => {
    const PRICE = ethers.parseEther("0.1")

    const nftContract = await deployments.get("NftMarketplace")
    const basicContract = await deployments.get("BasicNft")

    nftMarketplace = await ethers.getContractAt(
        nftContract.abi,
        nftContract.address,
    )
    // nftMarketplace = nftMarketplace.connect(deployer)

    basicNft = await ethers.getContractAt(
        basicContract.abi,
        basicContract.address,
    )

    console.log("Minting........")

    const mintTx = await basicNft.safeMint()
    const mintTxreceipt = await mintTx.wait(1)
    const tokenId = mintTxreceipt.logs[0].args.tokenId

    console.log("Approving NFT....")

    const approvalTx = await basicNft.approve(nftMarketplace.target, tokenId)
    console.log("listing NFT...")

    const tx = await nftMarketplace.listItem(basicNft.target, tokenId, PRICE)
    await tx.wait(1)
    console.log("Listed")

    // basicNft = basicNft.connect(deployer)

    // await basicNft.safeMint()
    // await basicNft.approve(nftMarketplace.target, TOKEN_ID)
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
