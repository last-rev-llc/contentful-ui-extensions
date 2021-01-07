import PropTypes from 'prop-types';

const schemaProp = PropTypes.shape({
  type: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  pattern: PropTypes.string,
  messages: PropTypes.object // { stringMin: "Some error" }
});

export const schemaPropType = PropTypes.oneOfType([
  // Optional multi-type schema (TODO)
  PropTypes.arrayOf(schemaProp),
  schemaProp
]);

export default { schemaPropType };
