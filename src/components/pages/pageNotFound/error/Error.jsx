import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Error.module.scss';

const cx = classNames.bind(styles);
import error from '../../../../assets/404.jpeg';

const Error = () => {
  return (
    <div className={cx('error')}>
      <div className={cx('container', 'error-wrapper')}>
        <img
          src={error}
          alt=""
          className={cx('image')}
          loading="eager"
          aria-hidden="true"
        />
        <h2 className={cx('title')}>Page Not Found</h2>
        <p className={cx('text')}>
          We’re sorry, the page you requested could not be found. Please go back
          to the homepage.
        </p>
        <Link to="/" className={cx('link')}>
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
