import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import classNames from 'classnames/bind';
import styles from './FormVerifier.module.scss';
import { Verifier } from '../../../../lib/Contracts/Verifier';
import ButtonSend from '../../../shared/buttonSend/ButtonSend';

const cx = classNames.bind(styles);

const FormVerifier = () => {
  const [userName, setUserName] = useState(null);
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState(null);
  const [verifier, setVerifier] = useState(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [verifierName, setVerifierName] = useState(null);
  const [isChecking, setIsChecking] = useState(false); // New status for tracking verification
  const [loading, setLoading] = useState(false);

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

    const getUser = async (web3Signer, verifierInstance) => {
      try {
        if (web3Signer && verifierInstance) {
          const userAddress = await web3Signer.getAddress();
          const existingName = await verifierInstance.getName(userAddress);
          setVerifierName(existingName);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };

    const initialize = async () => {
      const { web3Signer, verifierInstance } = await initEthers();
      if (web3Signer && verifierInstance) {
        await getUser(web3Signer, verifierInstance);
      }
    };

    initialize();
  }, [verifier]);

  const handleSetNameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tx = await verifier.setName(userName);
      await tx.wait(); // waiting for the transaction to complete
      setMessage(`Имя установлено: ${userName}`);
      setVerifierName(userName);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      if (error.message.includes('this address already have name')) {
        setMessage('Ошибка: для этого адреса уже установлено имя.');
      } else {
        setMessage('Не удалось установить имя.');
      }
    }
  };

  const handleGetTokenInfo = async (e) => {
    setLoading(true);

    e.preventDefault();
    try {
      setIsChecking(true); // The beginning of the verification
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

      // Check if the token is already verified
      const isVerified = await verifier.isTokenVerified(tokenAddress);
      setIsTokenVerified(isVerified);
      if (isVerified) {
        setMessage(`Токен ${name} уже верифицирован.`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Ошибка при получении информации о токене.');
    } finally {
      setLoading(false);
      setIsChecking(false); // End of verification
    }
  };

  const handleVerifySubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    try {
      if (verifier) {
        const tx = await verifier.verify(tokenAddress);
        await tx.wait();
        setMessage(`Контракт ${tokenAddress} верифицирован.`);
        setIsTokenVerified(true);
      }
    } catch (error) {
      console.error(error);
      setMessage('Не удалось верифицировать контракт.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Регистрация и верификация</h2>

      {!verifierName && (
        <form
          onSubmit={handleSetNameSubmit}
          className={cx('form', 'token-form')}
        >
          <div className={cx('input-group')}>
            <input
              required
              type="text"
              name="text"
              className={cx('input')}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <label className={cx('label')}>Имя</label>
          </div>

          <ButtonSend loading={loading} text="Отправить" />
        </form>
      )}

      {verifierName && (
        <form
          className={cx('form', 'token-form')}
          onSubmit={handleGetTokenInfo}
        >
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

          <ButtonSend loading={loading} text="Получить информацию" />
        </form>
      )}

      {!isChecking && tokenInfo && !isTokenVerified && (
        <>
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
          </ul>
          <form
            onSubmit={handleVerifySubmit}
            className={cx('form', 'token-form')}
          >
            <ButtonSend loading={loading} text="Верифицировать" />
          </form>
        </>
      )}

      {message && <p className={cx('message')}> {message}</p>}
    </div>
  );
};

export default FormVerifier;
