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
        console.log(verifierAddresses);

        const verifiedNames = await Promise.all(
          verifierAddresses.map((address) => {
            return verifier.getName(address);
          })
        );

        const tokensWithVerifierNames = tokens.map((token, index) => ({
          ...token,
          verifierName: verifiedNames[index],
        }));
        setAddressWithName(tokensWithVerifierNames);

        // console.log(tokensWithVerifierNames);
        // console.log(verifiedAddresses);
        // console.log(verifiedNames);

        const unverified = allTokens.filter(
          (token) => !verifiedAddresses.includes(token)
        );
        setUnverifiedTokens(unverified);
      }
    };

    fetchTokens();
  }, [verifier, factory]);

  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Выпущенные токены</h2>

      <div className={cx('info-tokens')}>
        <h3 className={cx('title')}>Верифицированные токены</h3>

        <ul className={cx('list')}>
          {addressWithName.map((token, index) => (
            <li key={index} className={cx('item')}>
              {/* Коллекция:  */}
              {token.contractAddress}

              {/* {token.verifierAddress} */}
              {/* , Верификатор: */}
              {/* {token.verifierName} */}
            </li>
          ))}
        </ul>
      </div>

      <div className={cx('info-tokens')}>
        <h3 className={cx('title')}>Неверифицированные токены</h3>
        <ul className={cx('list')}>
          {/* <li className={cx('item')}> Адрес токена</li> */}
          {unverifiedTokens.map((token, index) => (
            <li key={index} className={cx('item')}>
              {token}
            </li>
          ))}
        </ul>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SearchToken;
