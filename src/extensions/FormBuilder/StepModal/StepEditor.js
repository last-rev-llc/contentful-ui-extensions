import React from 'react';
import PropTypes from 'prop-types';
import { curry } from 'lodash/fp';
import { Button, FieldGroup, FormLabel, TextInput } from '@contentful/forma-36-react-components';

import DependsOn from '../StepList/DependsOn';
import { useSDK } from '../../../context';

function StepEditor({ step, updateStep }) {
  const sdk = useSDK();
  const updateStepEvent = curry((key, event) => updateStep(key, event.currentTarget.value));

  const handleSubmit = () => sdk.close({ step });
  const handleCancel = () => sdk.close({ step: null });

  const { title = '' } = step;

  return (
    <>
      <FieldGroup>
        <FormLabel htmlFor="title">Label</FormLabel>
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

StepEditor.propTypes = {
  step: PropTypes.shape({
    title: PropTypes.string,
    dependsOn: PropTypes.string,
    dependsOnTests: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  updateStep: PropTypes.func.isRequired
};

StepEditor.defaultProps = {};

export default StepEditor;
