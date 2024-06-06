import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Verifier } from '../../../../lib/Contracts/Verifier';
import classNames from 'classnames/bind';
import styles from './FormConsumer.module.scss';
import Button from '../../../shared/button/Button';

const cx = classNames.bind(styles);

const FormConsumer = () => {
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState(null);
  const [verifier, setVerifier] = useState(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
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

    initEthers();
  }, []);

  const handleGetTokenInfo = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function totalSupply() view returns (uint)',
          'function getApproveDocs() view returns (string)',
        ],
        provider
      );

      const [name, symbol, totalSupply, approveDocs] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.totalSupply(),
        tokenContract.getApproveDocs(),
      ]);

      setMessage('');

      try {
        if (await verifier.isTokenVerified(tokenAddress)) {
          // We get the addresses of the contract and the verifier
          const approvedCollections = await verifier.getApprowedNftCollection();
          const verifierAddress = approvedCollections.find(
            (event) => event.contractAddress === tokenAddress
          )?.verifierAddress;

          // If you have found the address of the verifier
          if (verifierAddress) {
            const verifierName = await verifier.getName(verifierAddress);
            setTokenInfo({
              name,
              symbol,
              totalSupply: totalSupply.toString(),
              approveDocs,
              verifier: `Верифицировал: ${verifierName}.`,
            });
          }
        } else {
          setTokenInfo({
            name,
            symbol,
            totalSupply: totalSupply.toString(),
            approveDocs,
            verifier: 'Токен не верифицирован',
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setTokenInfo(null);
      setLoading(false);
      setMessage('Ошибка при получении информации о токене.');
    }
  };

  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Просмотреть контракт</h2>
      <form className={cx('form', 'token-form')} onSubmit={handleGetTokenInfo}>
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

        <Button className={cx('button-green')} loading={loading} type="submit">
          Получить информацию
        </Button>
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
          <li className={cx('item')}>
            <p>
              Документы одобрения:
              <a href={tokenInfo.approveDocs}>{tokenInfo.approveDocs}</a>
            </p>
          </li>
          <li className={cx('item')}>
            <p> {tokenInfo.verifier} </p>
          </li>
        </ul>
      )}
      {message && !tokenInfo && (
        <p className={cx('message', 'error-message')}> {message}</p>
      )}
    </div>
  );
};

export default FormConsumer;
