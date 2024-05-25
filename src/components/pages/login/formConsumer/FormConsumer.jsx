

import { useState } from 'react';
import { ethers } from 'ethers';
import { ERC20Carbon } from '../../../../lib/Contracts/ERC20Carbon';
import classNames from 'classnames/bind';
import styles from './FormConsumer.module.scss';

const cx = classNames.bind(styles);

const FormConsumer = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [contractInfo, setContractInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchContractInfo = async (event) => {
    event.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ERC20Carbon.abi, signer);

        setLoading(true);
        setError('');
        setContractInfo('');

        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();

        const info = `
          Name: ${name}\n
          Symbol: ${symbol}\n
          Decimals: ${decimals}\n
          Total Supply: ${ethers.utils.formatUnits(totalSupply, decimals)}
        `;
        setContractInfo(info);
      } catch (error) {
        console.error(error);
        setError('Ошибка при получении информации о контракте. Пожалуйста, проверьте адрес контракта и попробуйте снова.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Пожалуйста, установите MetaMask!');
    }
  };

  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Просмотреть контракт</h2>
      <form onSubmit={fetchContractInfo} className={cx('form', 'token-form')}>
        <div className={cx('input-group')}>
          <input
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            required
            className={cx('input')}
          />
          <label className={cx('label')}>Адрес контракта</label>
        </div>
        <button type="submit" className={cx('button-green')} disabled={loading}>
          {loading ? 'Поиск...' : 'Поиск'}
        </button>
      </form>
      {error && <p className={cx('error')}>{error}</p>}
      <pre>{contractInfo}</pre>
    </div>
  );
};

export default FormConsumer;
