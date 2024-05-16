import classNames from 'classnames/bind';
import styles from './FormVerifier.module.scss';

const cx = classNames.bind(styles);

const FormVerifier = () => {
  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Регистрация</h2>
      <form action="" className={cx('form', 'token-form')}>
        <div className={cx('input-group')}>
          <input required type="text" name="text" className={cx('input')} />
          <label className={cx('label')}>Имя</label>
        </div>
        <button className={cx('button-green')}>Отправить</button>
      </form>
    </div>
  );
};

export default FormVerifier;
