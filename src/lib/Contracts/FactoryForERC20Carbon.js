import {Contract, ethers} from "ethers";

const FACTORY_CONTRACT_ADDRESS = "0x13c814b3b19a266a4ee5275c284ED2b91352794F";
const FACTORY_CONTRACT_ABI = [
    "function createNewContract(string  _ipfsDocsForApprove, string _name, string _symbol, uint _totalSupply)",
    "function getContracts() view returns(address [])",
    "event NewContract(address indexed contractAddress, bytes32 indexed name, bytes32 indexed symbol, uint totalSupply)",
];


export class FactoryForERC20Carbon {

    constructor(signer, provider) {
        this.signer = signer;
        this.provider = provider;
    }

    async createNewToken(ipfsDocsForApprove, name, symbol, totalSupply) {
        const factoryContract = new Contract(FACTORY_CONTRACT_ADDRESS, FACTORY_CONTRACT_ABI, this.signer);
        const newContractResponse = await factoryContract.createNewContract(ipfsDocsForApprove, name, symbol, totalSupply);
        await newContractResponse.wait();
        console.log("newContractResponse: " + JSON.stringify(newContractResponse));
        return newContractResponse;
    }

    async logContractsFromStorage() {
        let contractFactory = new Contract(FACTORY_CONTRACT_ADDRESS, FACTORY_CONTRACT_ABI, this.provider);
        let contracts = await contractFactory.getContracts();
        return (JSON.parse(JSON.stringify(contracts)));
    }

    async logContracts() {
        let contractFactory = new Contract(FACTORY_CONTRACT_ADDRESS, FACTORY_CONTRACT_ABI, this.provider);
        let iface = new ethers.Interface(FACTORY_CONTRACT_ABI);

        let contracts = await contractFactory.queryFilter('NewContract')
        let resultContracts = [];

        contracts.forEach(contract => {
            let ifacelog = iface.decodeEventLog('NewContract', contract.data, contract.topics);
            resultContracts.push({
                contractAddress: ifacelog[0],
                name: ethers.decodeBytes32String(ifacelog[1]),
                symbol: ethers.decodeBytes32String(ifacelog[2]),
                totalSupply: Number(ifacelog[3]),
            })
        });
        return resultContracts;
    }

    async onNewContract(func) {
        let contractFactory = new Contract(FACTORY_CONTRACT_ADDRESS, FACTORY_CONTRACT_ABI, this.provider);
        contractFactory.on("NewContract", (contractAddress, name, symbol, totalSupply) => {
            let _name = ethers.decodeBytes32String(name);
            let _symbol = ethers.decodeBytes32String(symbol);
            let _totalSupply = Number(totalSupply);
            console.log("Event NewContract is on");
            console.log("contractAddress:" + contractAddress);
            console.log("name:" + _name);
            console.log("symbol:" + _symbol);
            console.log("totalSupply:" + _totalSupply);
            func(contractAddress, _name, _symbol, _totalSupply);
        })
    }

}






