import React from 'react';
import PropTypes from 'prop-types';
import { FieldGroup, CheckboxField } from '@contentful/forma-36-react-components';

import FieldTypeSelector from './FieldTypeSelector';

function Toggleable({ field, updateField }) {
  return (
    <FieldGroup>
      <CheckboxField
        labelText="Show by default?"
        defaultChecked={field.defaultValue}
        onChange={(e) => updateField('defaultValue', e.currentTarget.checked)}
      />
      <FieldTypeSelector field={field.field} updateField={(newField) => updateField({ field: newField })} />
    </FieldGroup>
  );
}

Toggleable.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    field: PropTypes.object,
    id: PropTypes.string,
    type: PropTypes.string,
    defaultValue: PropTypes.bool
  }).isRequired
};

export default Toggleable;
