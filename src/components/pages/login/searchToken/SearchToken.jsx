import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import classNames from 'classnames/bind';
import styles from './SearchToken.module.scss';
import { Verifier } from '../../../../lib/Contracts/Verifier';
import { FactoryForERC20Carbon } from '../../../../lib/Contracts/FactoryForERC20Carbon';
const cx = classNames.bind(styles);

const SearchToken = () => {
  const [message, setMessage] = useState('');
  const [verifier, setVerifier] = useState(null);
  const [factory, setFactory] = useState(null);
  const [addressWithName, setAddressWithName] = useState([]);
  const [unverifiedTokens, setUnverifiedTokens] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
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
      if (verifier && factory) {
        const tokens = await verifier.getApprowedNftCollection();
        const allTokens = await factory.logContractsFromStorage();

        const verifiedAddresses = tokens.map((token) => token.contractAddress);
        const verifierAddresses = tokens.map((token) => token.verifierAddress);

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
              ],
              verifier.provider
            );
            const symbol = await tokenContract.symbol();
            const totalSupply = await tokenContract.totalSupply();
            return {
              ...token,
              symbol,
              totalSupply: totalSupply.toString(),
            };
          })
        );

        setAddressWithName(tokenDetails);

        const unverified = allTokens.filter(
          (token) => !verifiedAddresses.includes(token)
        );
        setUnverifiedTokens(unverified);
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
          {addressWithName.map((token, index) => (
            <li
              key={index}
              className={cx(
                'item',
                'item-verifier',
                expandedIndex === index ? 'active' : null
              )}
            >
              {expandedIndex === index ? null : (
                <p onClick={() => handleClick(index)}>
                  {token.contractAddress}
                </p>
              )}
              {expandedIndex === index && (
                <div
                  className={cx('item-wrapper')}
                  onClick={() => handleClick(index)}
                >
                  <p className={cx('item-text')}>
                    <span className={cx('span-text')}>Адрес&nbsp;токена: </span>
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
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className={cx('info-tokens')}>
        <h3 className={cx('title')}>Неверифицированные токены</h3>
        <ul className={cx('list')}>
          {unverifiedTokens.map((token, index) => (
            <li key={index} className={cx('item')}>
              <p className={cx('item-text')}>
                {/* <span className={cx('span-text')}>Адрес токена: </span>  */}

                {token}
              </p>
            </li>
          ))}
        </ul>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SearchToken;
