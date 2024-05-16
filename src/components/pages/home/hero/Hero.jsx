import classNames from 'classnames/bind';

import styles from './Hero.module.scss';

const cx = classNames.bind(styles);
const Hero = () => {
  return (
    <section className={cx('hero')}>
      <div className={cx('container', 'hero-container')}></div>
    </section>
  );
};

export default Hero;
