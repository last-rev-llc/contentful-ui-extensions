import React from 'react';
import PropTypes from 'prop-types';
import { FieldGroup, FormLabel, Option, Select } from '@contentful/forma-36-react-components';

import AdditionalFields from './AdditionalFields';

const fieldTypes = [
  // prettier-no-wrap
  { value: 'toggleable', label: 'Toggleable' },
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
  { value: 'url', label: 'Url' },
  { value: 'week', label: 'Week' }
];

function FieldTypeSelector({ field, updateField, updateFieldEvent }) {
  return (
    <>
      <FieldGroup>
        <FormLabel htmlFor="type">Field Type</FormLabel>
        <Select required id="type" name="type" defaultValue={field.type} onChange={updateFieldEvent('type')}>
          {fieldTypes.map(({ value: fieldType, label }) => (
            <Option key={fieldType} testId="cf-ui-select-option" value={fieldType}>
              {label}
            </Option>
          ))}
        </Select>
      </FieldGroup>
      <AdditionalFields updateField={updateField} field={field} />
    </>
  );
}

FieldTypeSelector.propTypes = {
  updateField: PropTypes.func.isRequired,
  updateFieldEvent: PropTypes.func.isRequired,
  field: PropTypes.shape({
    type: PropTypes.string
  }).isRequired
};

export default FieldTypeSelector;
