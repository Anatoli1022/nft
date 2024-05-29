import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import classNames from 'classnames/bind';
import styles from './FormVerifier.module.scss';
import { Verifier } from '../../../../lib/Contracts/Verifier';
import { FactoryForERC20Carbon } from '../../../../lib/Contracts/FactoryForERC20Carbon';

const cx = classNames.bind(styles);

const FormVerifier = () => {
  const [name, setName] = useState(null);
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [verifier, setVerifier] = useState(null);
  const [factory, setFactory] = useState(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(false); // Новое состояние для отслеживания проверки

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

    const getUser = async (web3Signer, verifierInstance) => {
      try {
        if (web3Signer && verifierInstance) {
          const userAddress = await web3Signer.getAddress();
          const existingName = await verifierInstance.getName(userAddress);
          setName(existingName);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        setMessage(
          'Ошибка получения данных пользователя. Проверьте консоль для получения дополнительной информации.'
        );
      }
    };

    const initialize = async () => {
      const { web3Signer, verifierInstance } = await initEthers();
      if (web3Signer && verifierInstance) {
        await getUser(web3Signer, verifierInstance);
      }
    };

    initialize();
  }, []);

  const handleSetNameSubmit = async (e) => {
    e.preventDefault();
    try {
      if (verifier) {
        const userAddress = await signer.getAddress();
        const existingName = await verifier.getName(userAddress);

        if (existingName) {
          setMessage(`Вы уже зарегистрированы с именем: ${existingName}`);
        } else {
          const tx = await verifier.setName(name);
          await tx.wait(); // ожидание завершения транзакции
          setMessage(`Имя установлено: ${name}`);
        }
      }
    } catch (error) {
      console.error(error);
      if (error.message.includes('this address already have name')) {
        setMessage('Ошибка: для этого адреса уже установлено имя.');
      } else {
        setMessage('Не удалось установить имя.');
      }
    }
  };

  const handleGetTokenInfo = async () => {
    try {
      setIsChecking(true); // Начало проверки
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
      setIsChecking(false); // Конец проверки
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    try {
      if (verifier) {
        if (isTokenVerified) {
          setMessage('Этот токен уже верифицирован.');
        } else {
          const tx = await verifier.verify(tokenAddress);
          await tx.wait();
          setMessage(`Контракт ${tokenAddress} верифицирован.`);
          setIsTokenVerified(true);
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('Не удалось верифицировать контракт.');
    }
  };

  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Регистрация и верификация</h2>

      {!name && (
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className={cx('label')}>Имя</label>
          </div>
          <button type="submit" className={cx('button-green')}>
            Отправить
          </button>
        </form>
      )}

      {name && (
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
            <button
              type="submit"
              className={cx('button-green', 'button-verifier')}
            >
              Верифицировать
            </button>
          </form>
        </>
      )}

      {message && <p className={cx('message')}> {message}</p>}
    </div>
  );
};

export default FormVerifier;
