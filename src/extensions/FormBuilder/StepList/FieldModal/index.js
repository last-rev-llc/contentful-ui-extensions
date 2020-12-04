import React, { useState } from 'react';
import { curry, omit } from 'lodash/fp';
import { Button } from '@contentful/forma-36-react-components';

import DependsOn from '../../DependsOn';
import { useSDK } from '../../../../context';

import { ModalStyle } from '../styles';
import { normalizeValues, denormalizeValues } from '../utils';

import FieldEditor from './FieldEditor';

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

  const { name = '' } = field;

  return (
    <ModalStyle>
      <FieldEditor title="Field Editor" field={field} updateField={updateField} />
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
