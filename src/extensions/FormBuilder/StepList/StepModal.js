import React, { useState } from 'react';
import { curry, omit } from 'lodash/fp';
import { Heading, Button, FieldGroup, FormLabel, TextInput } from '@contentful/forma-36-react-components';

import DependsOn from '../DependsOn';
import { useSDK } from '../../../context';

import { ModalStyle } from './styles';
import { extractValue, denormalizeValues, normalizeValues } from './utils';

function FieldModal() {
  const sdk = useSDK();
  const [step, setStep] = useState(omit(['modal'], normalizeValues(sdk.parameters.invocation)));

  const updateStep = curry((key, event) =>
    setStep((prev) => ({
      ...prev,
      [key]: extractValue(event)
    }))
  );

  const handleCancel = () => sdk.close({ step: null });
  const handleSubmit = () => sdk.close({ step: denormalizeValues(step) });

  return (
    <ModalStyle>
      <Heading>Edit Step</Heading>
      <FieldGroup>
        <FormLabel htmlFor="title">Step Name</FormLabel>
        <TextInput required defaultValue={step.title} onChange={updateStep('title')} />
      </FieldGroup>
      <DependsOn
        value={step.dependsOn}
        tests={step.dependsOnTests}
        onChangeValue={updateStep('dependsOn')}
        onChangeTests={updateStep('dependsOnTests')}
      />
      <FieldGroup>
        <div className="confirm-delete-dialog-actions">
          <Button type="submit" buttonType="negative" size="small" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            size="small"
            type="submit"
            className="confirm-delete-dialog-button"
            onClick={handleSubmit}
            disabled={step.title.length < 1}>
            Save
          </Button>
        </div>
      </FieldGroup>
    </ModalStyle>
  );
}

export default FieldModal;