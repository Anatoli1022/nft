import {FactoryForERC20Carbon} from './NFTrend/Contracts/FactoryForERC20Carbon';
import {ERC20Carbon} from './NFTrend/Contracts/ERC20Carbon';
import {Verifier} from "./NFTrend/Contracts/Verifier.js";
import {Contract, ethers} from "ethers";




let signer = null;
let provider = null;
if (window.ethereum == null) {

    // If MetaMask is not installed, we use the default provider,
    // which is backed by a variety of third-party services (such
    // as INFURA). They do not have private keys installed,
    // so they only have read-only access
    console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()
} else {
    console.log("MetaMask exist")

    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum)

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signer = await provider.getSigner();
}


//let factory = new FactoryForERC20Carbon(signer, provider);
//factory.createNewToken("test/test/1", "myToken", "MTK", 100); //создание токена erc20 c документацией в test/test/1
//let contractsList = await factory.logContracts() // список контрактов в виде массива объектов из журнала событий
//factory.logContractsFromStorage() //массив адресов контрактов из хранилища
//factory.onNewContract((contractAddress, name, symbol, totalSupply) => console.log("new contract"+name));  //событие на создание контракта


let token = new ERC20Carbon(signer, provider, '0xb046fF38A68E609841b64b4eEe484A02b3384e46');
console.log(await token.getApproveDocs())
console.log(await token.getSymbol())
console.log(await token.getName())
console.log(await token.getDecimals())
console.log(await token.getTotalSupply())
console.log(await token.balanceOf("0xd1C3cE118EB8e3c84F019589351eD742e5229f5E"))

//let verifier = new Verifier(signer, provider);
//console.log(await verifier.getApprowedNftCollection());
//console.log(await verifier.getName('0x5c835789113ceCC6aB2D2a4AcbD3937f877DDeFA'));
//console.log(await verifier.verify('0xb046fF38A68E609841b64b4eEe484A02b3384e46'));
