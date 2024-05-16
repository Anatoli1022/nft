import classNames from 'classnames/bind';
import styles from './ButtonsList.module.scss';

const cx = classNames.bind(styles);
const ButtonsList = ({ toggleForm, showForm }) => {
  return (
    <ul className={cx('buttons-wrapper')}>
      <li>
        <button
          onClick={() => toggleForm('issuer')}
          className={cx(
            'button-green',
            showForm === 'issuer' ? 'button-active' : null
          )}
        >
          Эмитент
        </button>
      </li>
      <li>
        {' '}
        <button
          onClick={() => toggleForm('verifier')}
          className={cx(
            'button-green',
            showForm === 'verifier' ? 'button-active' : null
          )}
        >
          Верификатор
        </button>
      </li>
      <li>
        <button
          onClick={() => toggleForm('consumer')}
          className={cx(
            'button-green',
            showForm === 'consumer' ? 'button-active' : null
          )}
        >
          Потребитель (Завод)
        </button>
      </li>{' '}
      <li>
        <button
          onClick={() => toggleForm('searchToken')}
          className={cx(
            'button-green',
            showForm === 'searchToken' ? 'button-active' : null
          )}
        >
          Поиск токена
        </button>
      </li>
    </ul>
  );
};

export default ButtonsList;
