import {Contract, ethers} from "ethers";

const ERC20Carbon_CONTRACT_ABI = [
    "function getApproveDocs() view returns(string)",
    "function name() public view returns (string)",
    "function symbol() public view returns (string)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
    "function balanceOf(address account) public view returns (uint256)",
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

    async getName() {
        let contractERC20 = new Contract(this.contractAddress, ERC20Carbon_CONTRACT_ABI, this.provider);
        let result = await contractERC20.name();
        return result;
    }

    async getSymbol() {
        let contractERC20 = new Contract(this.contractAddress, ERC20Carbon_CONTRACT_ABI, this.provider);
        let result = await contractERC20.symbol();
        return result;
    }

    async getDecimals() {
        let contractERC20 = new Contract(this.contractAddress, ERC20Carbon_CONTRACT_ABI, this.provider);
        let result = await contractERC20.decimals();
        return Number(result);
    }

    async getTotalSupply() {
        let contractERC20 = new Contract(this.contractAddress, ERC20Carbon_CONTRACT_ABI, this.provider);
        let result = await contractERC20.totalSupply();
        return Number(result);
    }

    async balanceOf(address) {
        let contractERC20 = new Contract(this.contractAddress, ERC20Carbon_CONTRACT_ABI, this.provider);
        let result = await contractERC20.balanceOf(address);
        return Number(result);
    }
}
