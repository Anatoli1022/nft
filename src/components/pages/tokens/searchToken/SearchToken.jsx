import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import classNames from 'classnames/bind';
import styles from './SearchToken.module.scss';
import { Verifier } from '../../../../lib/Contracts/Verifier';
import { FactoryForERC20Carbon } from '../../../../lib/Contracts/FactoryForERC20Carbon';
import LoaderGreen from '../../../shared/loaderGreen/LoaderGreen.jsx';

const cx = classNames.bind(styles);

const SearchToken = () => {
  const [message, setMessage] = useState('');
  const [verifier, setVerifier] = useState(null);
  const [factory, setFactory] = useState(null);
  const [addressWithName, setAddressWithName] = useState([]);
  const [unverifiedTokens, setUnverifiedTokens] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initEthers = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        setVerifier(new Verifier(web3Signer, web3Provider));
        setFactory(new FactoryForERC20Carbon(web3Signer, web3Provider));
      } else {
        setMessage('Пожалуйста, установите MetaMask!');
      }
    };

    initEthers();
  }, []);

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);

      if (verifier && factory) {
        try {
          const tokens = await verifier.getApprowedNftCollection();
          const allTokens = await factory.logContractsFromStorage();

          const verifiedAddresses = tokens.map(
            (token) => token.contractAddress
          );
          const verifierAddresses = tokens.map(
            (token) => token.verifierAddress
          );

          const verifiedNames = await Promise.all(
            verifierAddresses.map((address) => verifier.getName(address))
          );

          const tokensWithVerifierNames = tokens.map((token, index) => ({
            ...token,
            verifierName: verifiedNames[index],
          }));

          const tokenDetails = await Promise.all(
            tokensWithVerifierNames.map(async (token) => {
              const tokenContract = new ethers.Contract(
                token.contractAddress,
                [
                  'function symbol() view returns (string)',
                  'function totalSupply() view returns (uint256)',
                  'function getApproveDocs() view returns (string)',
                ],
                verifier.provider
              );
              const symbol = await tokenContract.symbol();
              const totalSupply = await tokenContract.totalSupply();
              const approveDocs = await tokenContract.getApproveDocs();
              return {
                ...token,
                symbol,
                totalSupply: totalSupply.toString(),
                approveDocs,
              };
            })
          );

          setAddressWithName(tokenDetails.reverse());

          const unverified = allTokens.filter(
            (token) => !verifiedAddresses.includes(token)
          );
          setUnverifiedTokens(unverified.reverse());
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTokens();
  }, [verifier, factory]);

  const handleClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Выпущенные токены</h2>

      <div className={cx('info-tokens')}>
        <h3 className={cx('title')}>Верифицированные токены</h3>

        <ul className={cx('list')}>
          {loading ? (
            <div className={cx('wrapper-loader')}>
              <LoaderGreen />
            </div>
          ) : null}

          {addressWithName.map((token, index) => {
            return (
              <li key={index} className={cx('item')}>
                <h3
                  className={cx(
                    'title-item',
                    'verifier',
                    expandedIndex === index ? 'active' : null
                  )}
                  onClick={() => handleClick(index)}
                >
                  {token.contractAddress}
                </h3>
                {expandedIndex === index && (
                  <div className={cx('item-wrapper')}>
                    <p className={cx('item-text')}>
                      <span className={cx('span-text')}>
                        Адрес&nbsp;токена:{' '}
                      </span>
                      {token.contractAddress}
                    </p>

                    <p className={cx('item-text')}>
                      <span className={cx('span-text')}>
                        Адрес&nbsp;верификатора:{' '}
                      </span>
                      {token.verifierAddress}
                    </p>
                    <p className={cx('item-text')}>
                      <span className={cx('span-text')}>
                        Имя&nbsp;верификатора:{' '}
                      </span>
                      {token.verifierName}
                    </p>
                    <p className={cx('item-text')}>
                      <span className={cx('span-text')}>Символ: </span>{' '}
                      {token.symbol}
                    </p>
                    <p className={cx('item-text')}>
                      <span className={cx('span-text')}>
                        Общее количество токенов:{' '}
                      </span>
                      {token.totalSupply}
                    </p>
                    <p className={cx('item-text')}>
                      <span className={cx('span-text')}>
                        Документы для одобрения:{' '}
                      </span>

                      <a href={token.approveDocs} target="_blank">
                        Посмотреть
                      </a>
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className={cx('info-tokens')}>
        <h3 className={cx('title')}>Неверифицированные токены</h3>
        <ul className={cx('list')}>
          {loading ? (
            <div className={cx('wrapper-loader')}>
              <LoaderGreen />
            </div>
          ) : null}

          {unverifiedTokens.map((token, index) => (
            <li key={index} className={cx('item')}>
              <h3 className={cx('title-item')}>{token}</h3>
            </li>
          ))}
        </ul>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SearchToken;
