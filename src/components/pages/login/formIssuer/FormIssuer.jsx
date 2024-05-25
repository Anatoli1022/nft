import { useState } from 'react';
import { ethers } from 'ethers';
import { FactoryForERC20Carbon } from '../../../../lib/Contracts/FactoryForERC20Carbon';
import classNames from 'classnames/bind';
import styles from './FormIssuer.module.scss';

const cx = classNames.bind(styles);

const FormIssuer = () => {
  const [ipfsDocsForApprove, setIpfsDocsForApprove] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('');

  const createToken = async (event) => {
    event.preventDefault();

    if (typeof window.ethereum === 'undefined') {
      alert(
        'MetaMask не установлен. Пожалуйста, установите MetaMask и попробуйте снова.'
      );
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
      alert('Пользователь отклонил доступ к аккаунту.');
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const factory = new FactoryForERC20Carbon(signer, provider);

    try {
      await factory.createNewToken(
        ipfsDocsForApprove,
        name,
        symbol,
        totalSupply
      );
      alert('Token created successfully!');
    } catch (error) {
      console.error(error);
      alert('Error creating token.');
    }
  };

  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Выпуск токенов</h2>

      <form onSubmit={createToken} className={cx('form', 'token-form')}>
        <div className={cx('input-group')}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={cx('input')}
          />
          <label className={cx('label')}>Имя токена</label>
        </div>
        <div className={cx('input-group')}>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
            className={cx('input')}
          />
          <label className={cx('label')}>Абревеатура токена (USD)</label>
        </div>
        <div className={cx('input-group')}>
          <input
            type="text"
            value={ipfsDocsForApprove}
            onChange={(e) => setIpfsDocsForApprove(e.target.value)}
            required
            className={cx('input')}
          />
          <label className={cx('label')}>
            ссылка на пакет документов в ipfs (token/abcd) ???
          </label>
        </div>{' '}
        <div className={cx('input-group')}>
          <input
            type="number"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
            required
            className={cx('input')}
          />
          <label className={cx('label')}>Количество выпускаемых токенов</label>
        </div>
        <button className={cx('button-green')}>Отправить</button>
      </form>
    </div>
  );
};

export default FormIssuer;
