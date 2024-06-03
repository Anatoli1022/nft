import cx from 'classnames';
import PropTypes from 'prop-types';
import Loader from '../loader/Loader';

const ButtonSend = ({ loading, text }) => {
  return (
    <button className={cx('button-green')} disabled={loading}>
      {loading ? <Loader /> : text}
    </button>
  );
};

export default ButtonSend;

ButtonSend.propTypes = {
  loading: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};
