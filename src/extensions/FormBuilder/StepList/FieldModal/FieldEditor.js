  /* eslint-disable react/forbid-prop-types */

  import React from 'react';
  import PropTypes from 'prop-types';
  import { FieldGroup, FormLabel, TextInput } from '@contentful/forma-36-react-components';
  import DependsOn from '../../DependsOn';
  import FieldTypeSelector from './FieldTypeSelector';

  import { errorOfType, errorTypes } from '../../validate';
  import { WarningStyle } from '../styles';

  function FieldEditor({ errors, field, updateField }) {
    const errorsForField = errors[field.id];
    const nameError = errorOfType(errorTypes.CONFLICT_NAME, errorsForField);

    return (
      <>
        <FieldGroup>
          <FormLabel htmlFor="label">Label</FormLabel>
          <TextInput required defaultValue={field.label} onChange={(e) => updateField('label', e.currentTarget.value)} />
        </FieldGroup>
        <FieldGroup>
          <FormLabel htmlFor="title">Form key</FormLabel>
          <TextInput required defaultValue={field.name} onChange={(e) => updateField('name', e.currentTarget.value)} />
          {nameError && <WarningStyle>{nameError.message}</WarningStyle>}
        </FieldGroup>
        <FieldTypeSelector field={field} updateField={updateField} errors={errors} />
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
    field: PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      name: PropTypes.string,
      dependsOn: PropTypes.string,
      dependsOnTests: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    updateField: PropTypes.func.isRequired,

    // eslint-disable-next-line
    errors: PropTypes.object, // containing { [id]: error<Object> }
    dependsOn: PropTypes.string,
    dependsOnTests: PropTypes.arrayOf(PropTypes.object)
  };

  FieldEditor.defaultProps = {
    dependsOn: '',
    dependsOnTests: []
  };

  export default FieldEditor;
