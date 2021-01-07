import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@contentful/forma-36-react-components';
import { ErrorStyle } from '../../styles';

import { errorOfType, errorTypes } from '../../../validate';

function extractValue({ value }) {
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function Hidden({ errors, updateField, field }) {
  const fieldErrors = errors[field.id];
  return (
    <>
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
      {errorOfType(errorTypes.INVALID_VALUE, fieldErrors) && <ErrorStyle>Hidden fields require a value</ErrorStyle>}
    </>
  );
}

Hidden.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.bool.isRequired, PropTypes.string.isRequired])
  }).isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object
};

Hidden.defaultProps = {
  errors: []
};

export default Hidden;
