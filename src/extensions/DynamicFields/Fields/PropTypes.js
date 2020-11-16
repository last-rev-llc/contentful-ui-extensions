import PropTypes from 'prop-types';

export const FieldPropTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
  about: PropTypes.string,
  required: PropTypes.bool,
  setValues: PropTypes.func,
  onChange: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

export const FieldDefaultProps = {
  children: null,
  className: '',
  error: false,
  title: null,
  about: null,
  required: false,
  onChange: null,
  setValues: null
};

export default { FieldPropTypes, FieldDefaultProps };
