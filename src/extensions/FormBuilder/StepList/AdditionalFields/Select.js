import React from 'react';
import PropTypes from 'prop-types';

function Select({ field }) {
  return <span>Hello</span>;
}

Select.propTypes = {
  field: PropTypes.shape({
    type: PropTypes.string.isRequired
  }).isRequired
};

export default Select;
