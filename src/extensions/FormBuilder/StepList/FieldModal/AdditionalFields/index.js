import React from 'react';
import PropTypes from 'prop-types';

import Select from './Select';
import Hidden from './Hidden';
import Toggleable from './Toggleable';

function AdditionalFields({ field, updateField }) {
  const { type } = field;
  switch (type) {
    case 'hidden':
      return <Hidden field={field} updateField={updateField} />;
    case 'select':
      return <Select field={field} updateField={updateField} />;
    case 'toggleable':
      return <Toggleable field={field} updateField={updateField} />;
    default:
      return null;
  }
}

AdditionalFields.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    type: PropTypes.string
  }).isRequired
};

export default AdditionalFields;
