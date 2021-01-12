/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import PropTypes from 'prop-types';

import Select from './Select';
import Hidden from './Hidden';
import Toggleable from './Toggleable';

function AdditionalFields({ field, updateField, ...props }) {
  const { type } = field;
  switch (type) {
    case 'hidden':
      return <Hidden key="hidden-field" field={field} updateField={updateField} {...props} />;
    case 'select':
      return <Select key="select-field" field={field} updateField={updateField} {...props} />;
    case 'toggleable':
      return <Toggleable key="toggleable-field" field={field} updateField={updateField} {...props} />;
    default:
      return null;
  }
}

AdditionalFields.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    type: PropTypes.string
  }).isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object
};

AdditionalFields.defaultProps = {
  errors: []
};

export default AdditionalFields;
