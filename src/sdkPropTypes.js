import PropTypes from 'prop-types';

const sdkProps = PropTypes.shape({
  field: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    validations: PropTypes.arrayOf(
      PropTypes.shape({
        in: PropTypes.array
      })
    )
  })
});

export default sdkProps;
