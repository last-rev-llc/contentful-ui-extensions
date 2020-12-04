import React from 'react';
import PropTypes from 'prop-types';
import { FieldGroup, CheckboxField } from '@contentful/forma-36-react-components';

function Toggleable({ field, updateField }) {
  return (
    <FieldGroup>
      <CheckboxField
        labelText="Show by default?"
        defaultChecked={field.defaultValue}
        onChange={(e) => updateField('defaultValue', e.currentTarget.checked)}
      />
    </FieldGroup>
  );
}

Toggleable.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    defaultValue: PropTypes.bool
  }).isRequired
};

export default Toggleable;
