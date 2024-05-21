import {Contract, ethers} from "ethers";

const ERC20Carbon_CONTRACT_ABI = [
    "function getApproveDocs() view returns(string)"
];


export class ERC20Carbon {

    constructor(signer, provider, contractAddress) {
        this.signer = signer;
        this.provider = provider;
        this.contractAddress = contractAddress;
    }

    async getApproveDocs() {
        let contractERC20 = new Contract(this.contractAddress, ERC20Carbon_CONTRACT_ABI, this.provider);
            let docs = await contractERC20.getApproveDocs();
            return docs;
    }
}
