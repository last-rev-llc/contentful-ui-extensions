import React, { useState } from 'react';
import styled from 'styled-components';
import { curry, omit } from 'lodash/fp';
import { Button, FieldGroup, FormLabel, Option, Select, TextInput } from '@contentful/forma-36-react-components';

import DependsOn from '../DependsOn';
import { useSDK } from '../../../context';

const ModalStyle = styled.div`
  padding: 24px;
`;

const fieldTypes = [
  // prettier-no-wrap
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

function AdditionalFields({ type }) {
  switch (type) {
    case 'select':
      return <span>TODO</span>; // TODO: add options
    default:
      return null;
  }
}

function extractValue(event) {
  return event.currentTarget.value;
}

function hasValue(value) {
  if (value instanceof Object) {
    // Dealing with an event
    if (value.currentTarget) {
      return hasValue(extractValue(value));
    }

    return Object.keys(value).length > 0;
  }

  return Boolean(value);
}

function safeParse(maybeJson) {
  let parsed;
  try {
    parsed = JSON.parse(maybeJson);

    // We don't need to save empty dependsOn
    if (Object.keys(parsed).length < 1) {
      return undefined;
    }

    return parsed;
  } catch (error) {
    // pass

    return undefined;
  }
}

function denormalizeValues({ dependsOn, dependsOnTest, ...field }) {
  return {
    ...field,
    dependsOn: safeParse(dependsOn),
    dependsOnTest: safeParse(dependsOnTest)
  };
}

function normalizeValues({ dependsOnTest = {}, dependsOn = {}, ...field }) {
  return {
    ...field,
    dependsOn: JSON.stringify(dependsOn, null, 4),
    dependsOnTest: JSON.stringify(dependsOnTest, null, 4)
  };
}

function FieldModal() {
  const sdk = useSDK();
  const [field, setField] = useState(omit(['modal'], normalizeValues(sdk.parameters.invocation)));

  const updateField = curry((key, event) => {
    const currentValue = extractValue(event);
    if (hasValue(currentValue))
      setField((prev) => ({
        ...prev,
        [key]: currentValue
      }));
  });

  const handleCancel = () => sdk.close({ field: null });
  const handleSubmit = () => sdk.close({ field: denormalizeValues(field) });

  return (
    <ModalStyle>
      <FieldGroup>
        <FormLabel htmlFor="title">Field Name</FormLabel>
        <TextInput required defaultValue={field.name} onChange={updateField('name')} />
      </FieldGroup>
      <FieldGroup>
        <FormLabel htmlFor="type">Field Type</FormLabel>
        <Select required id="type" name="type" defaultValue={field.type} onChange={updateField('type')}>
          {fieldTypes.map(({ value: fieldType, label }) => (
            <Option key={fieldType} testId="cf-ui-select-option" value={fieldType}>
              {label}
            </Option>
          ))}
        </Select>
      </FieldGroup>
      <AdditionalFields type={field.type} />
      <DependsOn
        value={field.dependsOn}
        test={field.dependsOnTest}
        onChangeValue={updateField('dependsOn')}
        onChangeTest={updateField('dependsOnTest')}
      />
      <FieldGroup>
        <div className="confirm-delete-dialog-actions">
          <Button type="submit" buttonType="negative" size="small" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="small" type="submit" className="confirm-delete-dialog-button" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </FieldGroup>
    </ModalStyle>
  );
}

export default FieldModal;
