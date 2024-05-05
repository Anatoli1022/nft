import classNames from 'classnames/bind';

import styles from './Hero.module.scss';

import background from './images/background.jpg';

const cx = classNames.bind(styles);
const Hero = () => {
  return (
    <section className={cx('hero')}>
      <div className={cx('container', 'hero-container')}>
        <img
          src={background}
          alt=""
          aria-hidden="true"
          className={cx('background')}
          loading="eager"
        />
      </div>
    </section>
  );
};

export default Hero;
