import classNames from 'classnames/bind';
import styles from './SearchToken.module.scss';

const cx = classNames.bind(styles);

const SearchToken = () => {
  return (
    <div className={cx('wrapper-form')}>
      <h2 className={cx('title')}>Поиск токена</h2>
      <form action="" className={cx('form', 'token-form')}>
        <div className={cx('input-group')}>
          <input required type="text" name="text" className={cx('input')} />
          <label className={cx('label')}>Адрес контракта</label>
        </div>
        <button className={cx('button-green')}>Поиск</button>
      </form>{' '}
      <div>
        <p>1. Имя токена</p>
        <p>2. Абревеатура</p>
        <a>3. Сылка на документы</a>
        <p>4. Количество выпущенных токенов</p>
        <p>5. Количество токенов на балансе</p>
      </div>
      <ul className={cx('list')}>
        <li className={cx('item')}>ТОкет1_имя знак колличество верификаций</li>
        <li className={cx('item')}>ТОкет2_имя знак колличество верификаций</li>
        <li className={cx('item')}>ТОкет3_имя знак колличество верификаций</li>
      </ul>
    </div>
  );
};

export default SearchToken;
