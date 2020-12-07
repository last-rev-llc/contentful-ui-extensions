import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@contentful/forma-36-react-components';

function extractValue({ value }) {
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function Hidden({ updateField, field }) {
  return (
    <TextField
      id="value"
      name="value"
      labelText="Field value"
      value={extractValue(field)}
      onChange={(e) => {
        let value;

        try {
          // Try to load JSON types (true/false)
          value = JSON.parse(e.currentTarget.value);
        } catch (error) {
          // Default to loading as text
          value = e.currentTarget.value;
        }

        updateField('value', value);
      }}
    />
  );
}

Hidden.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.bool.isRequired, PropTypes.string.isRequired])
  }).isRequired
};

export default Hidden;
