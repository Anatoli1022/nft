
import PropTypes from 'prop-types';
import Loader from '../loader/Loader';

const Button = ({ loading, children, ...props }) => {
  return (
    <button  disabled={loading} {...props}>
      {loading ? <Loader /> : children}
    </button>
  );
};

export default Button;

Button.propTypes = {
  loading: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
};
