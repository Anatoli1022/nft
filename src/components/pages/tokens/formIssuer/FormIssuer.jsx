import { useState } from 'react';
import { ethers } from 'ethers';
import { FactoryForERC20Carbon } from '../../../../lib/Contracts/FactoryForERC20Carbon';
import classNames from 'classnames/bind';
import styles from './FormIssuer.module.scss';
import Button from '../../../shared/button/Button';

const cx = classNames.bind(styles);

const FormIssuer = () => {
  const [ipfsDocsForApprove, setIpfsDocsForApprove] = useState(null);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [textInfo, setTextInfo] = useState({ text: '', error: false });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const pinataJWT = import.meta.env.VITE_PINATA_JWT;

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const resetForm = () => {
    setName('');
    setSymbol('');
    setTotalSupply('');
    setSelectedFile();
    setIpfsDocsForApprove(null);
    setTextInfo({ text: '', error: false });
  };

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

      setTextInfo({
        text: 'Токен успешно создан!',
        error: false,
      });
    } catch (error) {
      console.error(error);
      setTextInfo({
        text: 'Ошибка создания токена.',
        error: true,
      });
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const handleSubmission = async () => {
    setIpfsDocsForApprove(null);
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('file', selectedFile);
      const metadata = JSON.stringify({
        name: selectedFile.name,
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', options);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pinataJWT}`,
        },
        body: formData,
      });
      const resData = await res.json();

      setIpfsDocsForApprove(resData.IpfsHash);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

        <div className={cx('wrapper-input-group')}>
          <div className={cx('input-group')}>
            <input
              type="file"
              onChange={changeHandler}
              className={cx('input', !selectedFile ? 'input-file' : null)}
              required
            />
            <label className={cx('label')}>Документ Ipfs</label>
          </div>

          <Button
            loading={loading}
            type="button"
            onClick={handleSubmission}
            className={cx('button-green', 'button-ipfs')}
          >
            Подтвердить
          </Button>
        </div>

        {ipfsDocsForApprove && (
          <a
            href={`https://ipfs.io/ipfs/${ipfsDocsForApprove}`}
            className={cx('link')}
            target="_blank"
          >
            Документы успешно загружены, нажмите для просмотра.
          </a>
        )}

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

        <Button className={cx('button-green')} loading={loading} type="submit">
          Отправить
        </Button>
      </form>
      <p className={cx('text-info', textInfo.error ? 'error' : 'success')}>
        {textInfo.text}
      </p>
    </div>
  );
};

export default FormIssuer;
