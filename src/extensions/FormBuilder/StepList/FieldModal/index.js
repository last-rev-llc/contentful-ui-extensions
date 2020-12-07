import React, { useState } from 'react';
import { curry, omit } from 'lodash/fp';
import { Button, TextField } from '@contentful/forma-36-react-components';

import DependsOn from '../../DependsOn';
import { useSDK } from '../../../../context';

import { ModalStyle } from '../styles';
import { normalizeValues, denormalizeValues } from '../utils';

import FieldEditor from './FieldEditor';

function isValid(field) {
  const { name } = field;
  if (name.length < 1) return false;

  const { type } = field;
  switch (type) {
    case 'select': {
      const { options = [] } = field;
      return options.length > 0 && options.every(({ label, value }) => label.length > 0 && value.length > 0);
    }

    default:
      break;
  }

  return true;
}

function FieldModal() {
  const sdk = useSDK();
  const [field, setField] = useState(omit(['modal'], normalizeValues(sdk.parameters.invocation)));

  const updateField = curry((key, newValue) => {
    setField((prev) => ({
      ...prev,
      [key]: newValue
    }));
  });

  const handleCancel = () => sdk.close({ field: null });
  const handleSubmit = () => sdk.close({ field: denormalizeValues(field) });

  return (
    <ModalStyle>
      <FieldEditor title="Field Editor" field={field} updateField={updateField} />
      <TextField
        labelText="Default value"
        name="defaultValue"
        id="defaultValue"
        onChange={(e) => {
          let value;

          try {
            // Try to load JSON types (true/false)
            value = JSON.parse(e.currentTarget.value);
          } catch (error) {
            // Default to loading as text
            value = e.currentTarget.value;
          }

          updateField('defaultValue', value);
        }}
      />
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
            disabled={!isValid(field)}>
            Save
          </Button>
        </div>
      </footer>
    </ModalStyle>
  );
}

export default FieldModal;
