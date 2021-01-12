import React from 'react';
import PropTypes from 'prop-types';
import { Option, SelectField } from '@contentful/forma-36-react-components';

import AdditionalFields from './AdditionalFields';

const fieldTypes = [
  { value: 'business-search', label: 'Business Search' },
  { value: 'button', label: 'Button' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'color', label: 'Color' },
  { value: 'date', label: 'Date' },
  { value: 'date-range', label: 'Date Range' },
  { value: 'datetime', label: 'Date Time' },
  { value: 'email', label: 'Email' },
  { value: 'file', label: 'File' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'hubspot', label: 'Hubspot' },
  { value: 'image', label: 'Image' },
  { value: 'month', label: 'Month' },
  { value: 'number', label: 'Number' },
  { value: 'password', label: 'Password' },
  { value: 'radio', label: 'Radio' },
  { value: 'range', label: 'Range' },
  { value: 'required', label: 'Required' },
  { value: 'reset', label: 'Reset' },
  { value: 'search', label: 'Search' },
  { value: 'select', label: 'Select' },
  { value: 'string', label: 'String' },
  { value: 'submit', label: 'Submit' },
  { value: 'tel', label: 'Tel' },
  { value: 'text', label: 'Text' },
  { value: 'text-toggle', label: 'Text Toggle' },
  { value: 'time', label: 'Time' },
  { value: 'time-range', label: 'Time Range' },
  { value: 'toggleable', label: 'Toggleable' },
  { value: 'url', label: 'Url' },
  { value: 'week', label: 'Week' },
  { value: 'country', label: 'Country' },
  { value: 'state', label: 'State (US)' }
];

function FieldTypeSelector({ errors, field, updateField }) {
  return (
    <>
      <SelectField
        required
        id="type"
        name="type"
        labelText="Field Type"
        value={field.type}
        onChange={(e) =>
          updateField({
            // Remove other stuff which was dependent on old field type
            schema: {},
            options: undefined,
            type: e.currentTarget.value
          })
        }>
        {fieldTypes.map(({ value: fieldType, label }) => (
          <Option key={fieldType} testId="cf-ui-select-option" value={fieldType}>
            {label}
          </Option>
        ))}
      </SelectField>
      <AdditionalFields updateField={updateField} field={field} errors={errors} />
    </>
  );
}

FieldTypeSelector.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    type: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object
};

FieldTypeSelector.defaultProps = {
  errors: []
};

export default FieldTypeSelector;
