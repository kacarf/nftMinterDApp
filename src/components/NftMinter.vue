<script setup lang="ts">
    import Moralis from 'moralis';
    import { ref } from 'vue';

    const nftFile = ref("");
    const treasuryWalletBalance = ref("0");
    const liquidityWalletBalance = ref("0");
    const amount = ref(0);
    
    async function getTreasuryWalletBalance() {
        treasuryWalletBalance.value = await treasuryContract.methods.getBalance().call();
    }

    async function getLiquidityWalletBalance() {
        liquidityWalletBalance.value = await liquidityContract.methods.getBalance().call();
    }
    function getBase64(file: File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })

    }
    function toBase64(file: File) {
         let reader = new FileReader();
            let nft: string | undefined = undefined;
            reader.readAsDataURL(file); //convert to base64
            reader.onload = function() {
                nft = reader.result!.toString();
                nftFile.value = nft;
            }
    }
    function getNftFile() {
        let file = (document.getElementById("nftUpload")! as HTMLInputElement).files;
        toBase64(file![0]);
    }
    async function uploadToIpfs(abiContent: Array<{ path: string, content: string }>) {
        return await Moralis.EvmApi.ipfs.uploadFolder({
            abi: abiContent
        })
    }
    async function distrubuteAmount(account: string) {
        let liquidityAmount = amount.value * 0.04;
        let treasuryAmount = amount.value * 0.06;
        await liquidityWalletContract.methods.deposit().send({ from: account, value: web3js.utils.toWei(liquidityAmount + "", "ether") });
        await treasuryWalletContract.methods.deposit().send({ from: account, value: web3js.utils.toWei(treasuryAmount + "", "ether") });
    }
    async function mintImage(uri: string) {
        const accounts = await web3js.eth.getAccounts();
        await nftMinterContract.methods.safeMint(window.ethereum.selectedAddress, uri).send({ from: accounts[0] });
        await distrubuteAmount(accounts[0]);
    }
    async function uploadToMoralis() {
        let uploadedImage = (document.getElementById("nftUpload")! as HTMLInputElement).files![0];

        let fileContent: string | undefined;
        await getBase64(uploadedImage).then((content) => {
            fileContent = <string>content;
        });

        if (fileContent) {
            const fileName = uploadedImage.name;
            let uploadFiles = [{ path: fileName, content: fileContent }];
            const fileUploadResponse = await uploadToIpfs(uploadFiles);
            const customFileRef  = fileUploadResponse.result[0].path.split("/");

            const metadata: any = {
                name: fileName,
                image: "ipfs://" + customFileRef [customFileRef .length - 2],
            };

            const metadataResponse = await uploadToIpfs([
            {
                path: fileName.split(".")[0] + ".json",
                content: metadata,
            },
            ]);

            const customMetadataRef  = metadataResponse.result[0].path.split("/");
            await mintImage("ipfs://" + customMetadataRef [customMetadataRef .length - 2]);
        }
    }
    
</script>
<template>
    <div>
        <div class="nft-info">
            <div class="nft-upload">
                <input class="file-name" type="text" placeholder="Name"/>
                <div class="file-upload-div col-12" onclick="document.getElementById('nftUpload').click()">
                    <div class="upload-file" aria-placeholder="Upload">
                        <span>Upload</span>
                    </div>
                </div>
                <input id="nftUpload" type="file" accept=".png, .jpg, .jpeg, .svg" style="display: none" @change="getNftFile()"/>
            </div>
            <div>
                <img v-if="nftFile" :src="nftFile" class="uploaded-nft"/>
                <div v-else class="no-image-preview">
                    <span>Item Preview</span>
                </div>
            </div>
        </div>
        <div class="price-and-mint">
            <div>
                <p style="color: white">Price</p>
                <input type="number" class="price-amount" v-model="amount" placeholder="Amount"/>
            </div>
            <button @click="uploadToMoralis" class="mint-button">MINT</button>
        </div>
        <div style="display: flex;">
            <div>
                <p>{{ liquidityWalletBalance }}</p>
                <button class="wallet-button" @click="getLiquidityWalletBalance()" style="background-color: red">Get Liquidity Wallet</button>
            </div>
            <div style="margin-left: auto">
                <p>{{ treasuryWalletBalance }}</p>
                <button class="wallet-button" @click="getTreasuryWalletBalance()" style="background-color: yellow;">Get Treasury Wallet</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .nft-info {
        display: flex;
        margin-bottom: 20px;
        border: 1px solid white;
        padding: 20px;
        border-radius: 4px;
    }
    .file-name{
        border: none;
        height: 60px;
        font-size: 16px;
        border-radius: 4px;
        padding: 4px 8px;
        margin-bottom: 25px;
        width: 240px;
    }
    .price-amount {
        border: none;
        height: 40px;
        font-size: 16px;
        border-radius: 4px;
        padding: 4px 8px;
        margin-bottom: 25px;
        width: 200px;
    }
    .file-name:focus {
        outline: none;
    }
    .file-upload-div {
        cursor: pointer;
    }
    .nft-upload {
        display: grid;
        align-items: center;
    }
    .upload-file {
        border: none;
        height: 60px;
        font-size: 16px;
        border-radius: 4px;
        padding: 4px 8px;
        background: white;
        color: black;
        display: flex;
        align-items: center;
        width: 240px;
    }

    .uploaded-nft {
        width: 300px;
        height: 150px;
        border-radius: 4px;
        border: 1px solid white;
        margin-left: 40px;
    }
    .no-image-preview {
        background: white;
        width: 300px;
        height: 150px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #000000;
        font-size: 24px;
        margin-left: 40px;
    }
    .price-and-mint {
        display: flex;
        align-items: center;
        border: 1px solid white;
        padding: 20px;
        border-radius: 4px;
        margin-bottom: 20px;
    }
    .mint-button {
        border: none;
        background: green;
        color: white;
        padding: 7px 24px;
        font-size: 20px;
        font-weight: 500;
        border-radius: 4px;
        cursor: pointer;
        margin-left: auto;
    }
    .wallet-button {
        border: none;
        color: black;
        padding: 7px 24px;
        font-size: 20px;
        font-weight: 500;
        border-radius: 4px;
        cursor: pointer;
    }

</style>