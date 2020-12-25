import React from 'react';
import PropTypes from 'prop-types';
import { Heading, FieldGroup, FormLabel, TextInput } from '@contentful/forma-36-react-components';
import DependsOn from '../../DependsOn';
import FieldTypeSelector from './FieldTypeSelector';

function FieldEditor({ title, field, updateField }) {
  const { name, label } = field;
  return (
    <>
      <FieldGroup>
        <FormLabel htmlFor="label">Field Label</FormLabel>
        <TextInput required defaultValue={label} onChange={(e) => updateField('label', e.currentTarget.value)} />
      </FieldGroup>
      <FieldGroup>
        <FormLabel htmlFor="title">Form key</FormLabel>
        <TextInput required defaultValue={name} onChange={(e) => updateField('name', e.currentTarget.value)} />
      </FieldGroup>
      <FieldTypeSelector field={field} updateField={updateField} />
      <DependsOn
        value={field.dependsOn}
        tests={field.dependsOnTests}
        onChangeValue={updateField('dependsOn')}
        onChangeTests={updateField('dependsOnTests')}
      />
    </>
  );
}

FieldEditor.propTypes = {
  title: PropTypes.string,
  field: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  updateField: PropTypes.func.isRequired
};

FieldEditor.defaultProps = {
  title: undefined
};

export default FieldEditor;
