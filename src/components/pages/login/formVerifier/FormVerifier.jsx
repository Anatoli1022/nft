import  { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import classNames from 'classnames/bind';
import styles from './FormVerifier.module.scss';
import { Verifier } from '../../../../lib/Contracts/Verifier'; // Убедитесь, что путь импорта верен

const cx = classNames.bind(styles);

const FormVerifier = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [verifier, setVerifier] = useState(null);

    useEffect(() => {
        const initEthers = async () => {
            if (window.ethereum) {
                const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                const web3Signer = web3Provider.getSigner();
                setProvider(web3Provider);
                setSigner(web3Signer);
                setVerifier(new Verifier(web3Signer, web3Provider));
            } else {
                setMessage('Пожалуйста, установите MetaMask!');
            }
        };

        initEthers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (verifier) {
                await verifier.setName(name);
                setMessage(`Имя установлено: ${name}`);
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

    return (
        <div className={cx('wrapper-form')}>
            <h2 className={cx('title')}>Регистрация</h2>
            <form onSubmit={handleSubmit} className={cx('form', 'token-form')}>
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
                <button type="submit" className={cx('button-green')}>Отправить</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FormVerifier;
