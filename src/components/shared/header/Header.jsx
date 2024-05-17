import classNames from 'classnames/bind';

import styles from './Header.module.scss';
import { Link } from 'react-router-dom';

import logo from '../../../assets/logo.jpeg';
const cx = classNames.bind(styles);
const logined = false;
const Header = () => {
  return (
    <header className={cx('header')}>
      <div className={cx('container')}>
        <nav className={cx('navigation')}>
          <div>
            <Link to="/">
              <img src={logo} loading="eager" className={cx('logo')} />
            </Link>
          </div>
          <ul className={cx('list')}>
            <li>
              <Link to="/" className={cx('link')}>
                Главная
              </Link>
            </li>
            <li>
              <Link to="/products" className={cx('link')}>
                Продукты
              </Link>
            </li>

            <li>
              {logined ? (
                <Link to="/profile" className={cx('link')}>
                  Профиль
                </Link>
              ) : (
                <Link to="/login" className={cx('link')}>
                  Войти
                </Link>
              )}
            </li>
            <li>
              <Link to="/profile" className={cx('link')}>
                Профиль test
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
