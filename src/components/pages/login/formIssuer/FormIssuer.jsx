import classNames from 'classnames/bind';
import styles from './FormIssuer.module.scss';

const cx = classNames.bind(styles);

const FormIssuer = () => {
  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Выпуск токенов</h2>
      <form action="" className={cx('form', 'token-form')}>
        <div className={cx('input-group')}>
          <input required type="text" name="text" className={cx('input')} />
          <label className={cx('label')}>Имя токена</label>
        </div>
        <div className={cx('input-group')}>
          <input required type="text" name="text" className={cx('input')} />
          <label className={cx('label')}>Абревеатура токена (USD)</label>
        </div>
        <div className={cx('input-group')}>
          <input required type="text" name="text" className={cx('input')} />
          <label className={cx('label')}>
            ссылка на пакет документов в ipfs (token/abcd) ???
          </label>
        </div>{' '}
        <div className={cx('input-group')}>
          <input required type="text" name="text" className={cx('input')} />
          <label className={cx('label')}>Количество выпускаемых токенов</label>
        </div>
        <button className={cx('button-green')}>Отправить</button>
      </form>
    </div>
  );
};

export default FormIssuer;
