import React, { useState } from 'react';
import { omit } from 'lodash/fp';
import { Button, FieldGroup, FormLabel, Heading, TextInput } from '@contentful/forma-36-react-components';

import DependsOn from '../../DependsOn';
import { useSDK } from '../../../../context';

import { ModalStyle } from '../styles';
import { normalizeValues, denormalizeValues } from '../utils';
import FieldTypeSelector from './FieldTypeSelector';

function FieldModal() {
  const sdk = useSDK();
  const [field, setField] = useState(omit(['modal'], normalizeValues(sdk.parameters.invocation)));

  const updateField = (key) => (newValue) => {
    setField((prev) => ({
      ...prev,
      [key]: newValue
    }));
  };

  const updateFieldEvent = (key) => (event) => {
    const { value } = event.currentTarget;
    updateField(key)(value);
  };

  const handleCancel = () => sdk.close({ field: null });
  const handleSubmit = () => sdk.close({ field: denormalizeValues(field) });

  const { name = '' } = field;

  return (
    <ModalStyle>
      <Heading>Edit Field</Heading>
      <FieldGroup>
        <FormLabel htmlFor="title">Field Name</FormLabel>
        <TextInput required defaultValue={name} onChange={updateFieldEvent('name')} />
      </FieldGroup>
      <FieldGroup>
        <FormLabel htmlFor="label">Field Label</FormLabel>
        <TextInput required defaultValue={field.label} onChange={updateFieldEvent('label')} />
      </FieldGroup>
      <FieldTypeSelector field={field} updateField={updateField} updateFieldEvent={updateFieldEvent} />
      <DependsOn
        value={field.dependsOn}
        tests={field.dependsOnTests}
        onChangeValue={updateField('dependsOn')}
        onChangeTests={updateField('dependsOnTests')}
      />
      <footer>
        <div className="confirm-delete-dialog-actions">
          <Button type="submit" buttonType="negative" size="small" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            size="small"
            type="submit"
            className="confirm-delete-dialog-button"
            onClick={handleSubmit}
            disabled={name.length < 1}>
            Save
          </Button>
        </div>
      </footer>
    </ModalStyle>
  );
}

export default FieldModal;
