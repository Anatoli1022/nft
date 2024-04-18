import classNames from 'classnames/bind';

import styles from './Header.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
const Header = () => {
  return (
    <header className={cx('header')}>
      <div className={cx('container')}>
        <nav className={cx('navigation')}>
          <div>
            <Link to="/">Logo</Link>
          </div>
          <ul className={cx('list')}>
            <li>
              <Link to="/" className={cx('link')}>
                Main Page
              </Link>
            </li>
            <li>
              <Link to="/allProducts" className={cx('link')}>
                All products
              </Link>
            </li>
            <li>
              <Link to="/profile" className={cx('link')}>
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
