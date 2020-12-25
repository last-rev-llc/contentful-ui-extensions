import React from 'react';
import { curry } from 'lodash/fp';
import { Heading, Button, FieldGroup, FormLabel, TextInput } from '@contentful/forma-36-react-components';

import DependsOn from '../../DependsOn';
import { useSDK } from '../../../../context';

import { denormalizeValues } from '../utils';

function StepEditor({ step, updateStep }) {
  const sdk = useSDK();
  const updateStepEvent = curry((key, event) => updateStep(key, event.currentTarget.value));

  const handleCancel = () => sdk.close({ step: null });
  const handleSubmit = () => sdk.close({ step: denormalizeValues(step) });

  const { title = '' } = step;

  return (
    <>
      <Heading>Edit Step</Heading>
      <FieldGroup>
        <FormLabel htmlFor="title">Step Name</FormLabel>
        <TextInput required defaultValue={title} onChange={updateStepEvent('title')} />
      </FieldGroup>
      <DependsOn
        value={step.dependsOn}
        tests={step.dependsOnTests}
        onChangeValue={updateStep('dependsOn')}
        onChangeTests={updateStep('dependsOnTests')}
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
            disabled={title.length < 1}>
            Save
          </Button>
        </div>
      </footer>
    </>
  );
}

export default StepEditor;
