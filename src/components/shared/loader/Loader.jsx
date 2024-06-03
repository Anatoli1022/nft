import classNames from 'classnames/bind';
import styles from './Loader.module.scss';

const cx = classNames.bind(styles);

const Loader = () => {
  return (
    <>
      <svg className={cx('loader')} viewBox="25 25 50 50">
        <circle className={cx('circle')} r="20" cy="50" cx="50"></circle>
      </svg>
    </>
  );
};

export default Loader;
