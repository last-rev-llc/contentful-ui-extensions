import React from 'react';
import PropTypes from 'prop-types';

import Select from './Select';

function AdditionalFields({ field }) {
  const { type } = field;
  switch (type) {
    case 'select':
      return <Select field={field} />; // TODO: add options
    default:
      return null;
  }
}

AdditionalFields.propTypes = {
  field: PropTypes.shape({
    type: PropTypes.string.isRequired
  }).isRequired
};

export default AdditionalFields;
