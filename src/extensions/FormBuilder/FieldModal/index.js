import React, { useState } from 'react';
import { curry, omit } from 'lodash/fp';
import { Button, Heading } from '@contentful/forma-36-react-components';

import { useSDK } from '../../../context';

import { ModalStyle } from '../styles';

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
  const { invocation } = sdk.parameters;
  const [field, setField] = useState(omit(['modal'], invocation.field || {}));

  const updateField = (maybeKeyMaybeObject, newValue = null) => {
    // Allow full object replacement (multiple keys)
    if (maybeKeyMaybeObject instanceof Object) {
      setField((prev) => ({
        ...prev,
        ...maybeKeyMaybeObject
      }));
      return;
    }

    // Allow setting by key & value
    setField((prev) => ({
      ...prev,
      [maybeKeyMaybeObject]: newValue
    }));
  };

  const handleCancel = () => sdk.close({ field: null });
  const handleSubmit = () => sdk.close({ field });

  return (
    <ModalStyle>
      <Heading>Field Editor</Heading>
      <FieldEditor field={field} updateField={updateField} />
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
