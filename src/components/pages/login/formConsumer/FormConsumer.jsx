import classNames from 'classnames/bind';
import styles from './FormConsumer.module.scss';

const cx = classNames.bind(styles);

const FormConsumer = () => {
  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Просмотреть контракт</h2>
      <form action="" className={cx('form', 'token-form')}>
        <div className={cx('input-group')}>
          <input required type="text" name="text" className={cx('input')} />
          <label className={cx('label')}>Адрес контракта</label>
        </div>
        <button className={cx('button-green')}>Поиск</button>
      </form>
    </div>
  );
};

export default FormConsumer;
