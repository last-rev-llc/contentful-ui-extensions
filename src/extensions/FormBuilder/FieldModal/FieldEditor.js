/* eslint-disable react/forbid-prop-types */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FieldGroup, TextField } from '@contentful/forma-36-react-components';
import DependsOn from '../StepList/DependsOn';

import SchemaEditor from './SchemaEditor';
import FieldTypeSelector from './FieldTypeSelector';

import { errorOfType, errorTypes } from '../validate';
import { WarningStyle } from '../StepList/styles';

const FieldEditorWrapper = styled.div`
  > * {
    margin-bottom: 1rem;
  }
`;

function FieldEditor({ errors, field, updateField }) {
  const errorsForField = errors[field.id];
  const nameError = errorOfType(errorTypes.CONFLICT_NAME, errorsForField);

  return (
    <FieldEditorWrapper>
      <TextField
        required
        id="label"
        name="label"
        labelText="Label"
        value={field.label}
        onChange={(e) => updateField('label', e.currentTarget.value)}
      />
      <FieldGroup>
        <TextField
          required
          id="name"
          name="name"
          labelText="Form key"
          value={field.name}
          onChange={(e) => updateField('name', e.currentTarget.value)}
        />
        {nameError && <WarningStyle>{nameError.message}</WarningStyle>}
      </FieldGroup>
      {field.type !== 'hidden' && (
        <TextField
          id="placeholder"
          name="placeholder"
          labelText="Placeholder"
          value={field.placeholder}
          onChange={(e) => updateField('placeholder', e.currentTarget.value)}
        />
      )}
      <FieldTypeSelector field={field} updateField={updateField} errors={errors} />
      <SchemaEditor field={field} updateField={updateField} />
      <DependsOn
        value={field.dependsOn}
        tests={field.dependsOnTests}
        onChangeValue={(newValue) => updateField('dependsOn', newValue)}
        onChangeTests={(newValue) => updateField('dependsOnTests', newValue)}
      />
    </FieldEditorWrapper>
  );
}

FieldEditor.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    dependsOn: PropTypes.string,
    dependsOnTests: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  updateField: PropTypes.func.isRequired,

  /* eslint-disable react/forbid-prop-types */
  errors: PropTypes.object, // containing { [id]: error<Object> }
  dependsOn: PropTypes.object,
  dependsOnTests: PropTypes.arrayOf(PropTypes.object)
  /* eslint-enable react/forbid-prop-types */
};

FieldEditor.defaultProps = {
  errors: {},
  dependsOn: {},
  dependsOnTests: []
};

export default FieldEditor;
