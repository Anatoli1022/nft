import classNames from 'classnames/bind';

import styles from './Character.module.scss';
import image from './a.jpg';

const cx = classNames.bind(styles);
const Character = () => {
  return (
    <section className={cx('section-character')}>
      <div className={cx('container')}>
        <div className={cx('items')}></div>
        <div className={cx('character')}>
          <img src={image} alt="" />
        </div>
      </div>
    </section>
  );
};

export default Character;
