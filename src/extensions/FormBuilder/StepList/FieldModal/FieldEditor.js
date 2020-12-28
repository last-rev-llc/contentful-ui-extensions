  /* eslint-disable react/forbid-prop-types */

  import React from 'react';
  import styled from 'styled-components';
  import PropTypes from 'prop-types';
  import { FieldGroup, FormLabel, TextInput, ValidationMessage } from '@contentful/forma-36-react-components';
  import DependsOn from '../../DependsOn';
  import FieldTypeSelector from './FieldTypeSelector';

  import { errorOfType, errorTypes } from '../../validate';

  const WarningStyle = styled(ValidationMessage)`
    svg {
      fill: #ff8c00;
    }

    p {
      color: #ff8c00;
    }
  `;

  function FieldEditor({ errors, field, updateField }) {
    const errorsForField = errors[field.id];

    return (
      <>
        <FieldGroup>
          <FormLabel htmlFor="label">Label</FormLabel>
          <TextInput required defaultValue={field.label} onChange={(e) => updateField('label', e.currentTarget.value)} />
        </FieldGroup>
        <FieldGroup>
          <FormLabel htmlFor="title">Form key</FormLabel>
          <TextInput required defaultValue={field.name} onChange={(e) => updateField('name', e.currentTarget.value)} />
          {errorOfType(errorTypes.CONFLICT_NAME, errorsForField) && (
            <WarningStyle>This name is a conflict with another</WarningStyle>
          )}
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
