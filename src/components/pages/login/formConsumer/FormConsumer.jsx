import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Verifier } from '../../../../lib/Contracts/Verifier';
import classNames from 'classnames/bind';
import styles from './FormConsumer.module.scss';

const cx = classNames.bind(styles);

const FormConsumer = () => {
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState(null);
  const [verifier, setVerifier] = useState(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [isTokenVerified, setIsTokenVerified] = useState(false);

  useEffect(() => {
    const initEthers = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        setProvider(web3Provider);

        const verifierInstance = new Verifier(web3Signer, web3Provider);

        setVerifier(verifierInstance);

        return { web3Signer, verifierInstance };
      } else {
        setMessage('Пожалуйста, установите MetaMask!');
      }
    };

    initEthers();
  }, []);

  const handleGetTokenInfo = async () => {
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

      setIsTokenVerified(await verifier.isTokenVerified(tokenAddress));

      if (isTokenVerified) {
        // Получаем адреса контракта и верификатора
        const approvedCollections = await verifier.getApprowedNftCollection();
        const verifierAddress = approvedCollections.find(
          (event) => event.contractAddress === tokenAddress
        )?.verifierAddress;

        // Если нашли адрес верификатора
        if (verifierAddress) {
          // Получаем имя верификатора
          const verifierName = await verifier.getName(verifierAddress);
          // setMessage(
          //   `Токен ${name} уже верифицирован. Верифицировал: ${verifierName}.`
          // );
          setMessage(` Верифицировал: ${verifierName}.`);
        } else {
          setMessage(
            `Не удалось найти информацию о верификаторе для токена ${name}.`
          );
        }
      } else {
        setMessage('Токен не верифицирован');
      }
    } catch (error) {
      console.error(error);
      setTokenInfo(null);
      setMessage('Ошибка при получении информации о токене.');
    }
  };

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
        </div>
        <button
          type="button"
          className={cx('button-green')}
          onClick={handleGetTokenInfo}
        >
          Получить информацию
        </button>
      </form>
      {tokenInfo && (
        <ul className={cx('list-info')}>
          <li className={cx('item')}>
            <p>Название: {tokenInfo.name}</p>
          </li>
          <li className={cx('item')}>
            <p>Символ: {tokenInfo.symbol}</p>
          </li>
          <li className={cx('item')}>
            <p>Общее количество: {tokenInfo.totalSupply}</p>
          </li>
          {message && (
            <li className={cx('item')}>
              <p> {message}</p>
            </li>
          )}
        </ul>
      )}
      {message && !tokenInfo && (
        <p className={cx('message', 'error-message')}> {message}</p>
      )}
    </div>
  );
};

export default FormConsumer;
