import { Contract, ethers } from 'ethers';

const VERIFIER_CONTRACT_ADDRESS = '0xA85Cb596c32f803f32e59c6eBe38Bb776C7199D9';
const VERIFIER_CONTRACT_ABI = [
  'event ApprowedNftCollection( address indexed collection, address indexed verifier )', //получает подтвержденные контракты
  'function setName(string memory __name) public', //устанавливает имя
  'function getName(address _address) external view returns (string memory)', //получает имя
  'function verify(address collection) external', //помечает контракт как подтвержденный
];

export class Verifier {
  constructor(signer, provider) {
    this.signer = signer;
    this.provider = provider;
  }

  async getApprowedNftCollection() {
    let verifierContract = new Contract(
      VERIFIER_CONTRACT_ADDRESS,
      VERIFIER_CONTRACT_ABI,
      this.provider
    );
    let iface = new ethers.Interface(VERIFIER_CONTRACT_ABI);

    let events = await verifierContract.queryFilter('ApprowedNftCollection');
    let resultEvents = [];

    events.forEach((event) => {
      console.log(event);
      let ifacelog = iface.decodeEventLog(
        'ApprowedNftCollection',
        event.data,
        event.topics
      );
      resultEvents.push({
        contractAddress: ifacelog[0],
        verifierAddress: ifacelog[1],
      });
    });

    return resultEvents;
  }

  async setName(_name) {
    let verifierContract = new Contract(
      VERIFIER_CONTRACT_ADDRESS,
      VERIFIER_CONTRACT_ABI,
      this.signer
    );
    let tx = await verifierContract.setName(_name);
    return tx;
  }
  async getName(_address) {
    let verifierContract = new Contract(
      VERIFIER_CONTRACT_ADDRESS,
      VERIFIER_CONTRACT_ABI,
      this.provider
    );
    let name = await verifierContract.getName(_address);
    return name;
  }
  async verify(erc20contractAddress) {
    let verifierContract = new Contract(
      VERIFIER_CONTRACT_ADDRESS,
      VERIFIER_CONTRACT_ABI,
      this.signer
    );
    let tx = await verifierContract.verify(erc20contractAddress);
    return tx;
  }

  async isTokenVerified(tokenAddress) {
    let approvedCollections = await this.getApprowedNftCollection();
    return approvedCollections.some(
      (event) => event.contractAddress === tokenAddress
    );
  }
}
