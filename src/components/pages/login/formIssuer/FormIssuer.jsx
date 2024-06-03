import { useState } from 'react';
import { ethers } from 'ethers';
import { FactoryForERC20Carbon } from '../../../../lib/Contracts/FactoryForERC20Carbon';
import classNames from 'classnames/bind';
import styles from './FormIssuer.module.scss';
// import Loader from '../../../shared/loader/Loader';
import ButtonSend from '../../../shared/buttonSend/ButtonSend';

const cx = classNames.bind(styles);

const FormIssuer = () => {
  const [ipfsDocsForApprove, setIpfsDocsForApprove] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [textInfo, setTextInfo] = useState({ text: '', error: false });
  const [loading, setLoading] = useState(false);

  const createToken = async (event) => {
    event.preventDefault();
    let signer = null;
    let provider;
    setLoading(true);

    if (window.ethereum == null) {
      setTextInfo({
        text: 'MetaMask не установлен. Пожалуйста, установите MetaMask и попробуйте снова.',
        error: true,
      });
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);

      signer = await provider.getSigner();
    }
    const factory = new FactoryForERC20Carbon(signer, provider);

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
      setTextInfo({
        text: 'Пользователь отклонил доступ к аккаунту.',
        error: true,
      });
      return;
    }

    try {
      await factory.createNewToken(
        ipfsDocsForApprove,
        name,
        symbol,
        totalSupply
      );
      setLoading(false);
      setTextInfo({
        text: 'Токен успешно создан!',
        error: false,
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      setTextInfo({
        text: 'Ошибка создания токена.',
        error: true,
      });
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
        </div>
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

        <ButtonSend loading={loading} text="Отправить" />
      </form>
      <p className={cx('text-info', textInfo.error ? 'error' : 'success')}>
        {textInfo.text}
      </p>
    </div>
  );
};

export default FormIssuer;
