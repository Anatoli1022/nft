import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Verifier } from '../../../../lib/Contracts/Verifier';
import { FactoryForERC20Carbon } from '../../../../lib/Contracts/FactoryForERC20Carbon';
import classNames from 'classnames/bind';
import styles from './FormConsumer.module.scss';

const cx = classNames.bind(styles);

const FormConsumer = () => {

  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [verifier, setVerifier] = useState(null);
  const [factory, setFactory] = useState(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [isTokenVerified, setIsTokenVerified] = useState(false);


  useEffect(() => {
    const initEthers = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(web3Signer);

        const verifierInstance = new Verifier(web3Signer, web3Provider);
        const factoryInstance = new FactoryForERC20Carbon(
          web3Signer,
          web3Provider
        );
        setVerifier(verifierInstance);
        setFactory(factoryInstance);
        return { web3Signer, verifierInstance };
      } else {
        setMessage('Пожалуйста, установите MetaMask!');
      }
    };

    initEthers();
  }, []);



  const handleGetTokenInfo= async () => {
    try {

  
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function totalSupply() view returns (uint)',
        ],
        provider
      );
      
      const [name, symbol, totalSupply] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.totalSupply(),
      ]);
  
      setTokenInfo({
        name,
        symbol,
        totalSupply: totalSupply.toString(),
      });
  
      setMessage('');
  
      const isVerified = await verifier.isTokenVerified(tokenAddress);
      setIsTokenVerified(isVerified);
  
      if (isVerified) {
        setMessage(`Токен ${name} уже верифицирован.`);
  
        // Получаем адреса контракта и верификатора
        const approvedCollections = await verifier.getApprowedNftCollection();
        const verifierAddress = approvedCollections.find(event => event.contractAddress === tokenAddress)?.verifierAddress;
  
        // Если нашли адрес верификатора
        if (verifierAddress) {
          // Получаем имя верификатора
          const verifierName = await verifier.getName(verifierAddress);
          setMessage(`Токен ${name} уже верифицирован. Верифицировал: ${verifierName}.`);
        } else {
          setMessage(`Не удалось найти информацию о верификаторе для токена ${name}.`);
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('Ошибка при получении информации о токене.');
    } 
  }
  

  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Просмотреть контракт</h2>

      <form className={cx('form', 'token-form')}>
        <div className={cx('input-group')}>
          <input
            required
            type="text"
            name="text"
            className={cx('input')}
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
          <label className={cx('label')}>Адрес токена</label>
          <button
            type="button"
            className={cx('button-green', 'button-take-info')}
            onClick={handleGetTokenInfo}
          >
            Получить информацию
          </button>
        </div>
      </form>

      {tokenInfo && (
        <>
          {' '}
          <div className={cx('token-info')}>
            <p>Название: {tokenInfo.name}</p>
            <p>Символ: {tokenInfo.symbol}</p>
            <p>Общее количество: {tokenInfo.totalSupply}</p>
          </div>
        </>
      )}

      {message && <p className={cx('message')}> {message}</p>}
    </div>
  );
};

export default FormConsumer;

{
  /* <form onSubmit={fetchContractInfo} className={cx('form', 'token-form')}>
        <div className={cx('input-group')}>
          <input
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            required
            className={cx('input')}
          />
          <label className={cx('label')}>Адрес контракта</label>
        </div>
        <button type="submit" className={cx('button-green')} disabled={loading}>
          {loading ? 'Поиск...' : 'Поиск'}
        </button>
      </form> */
}
