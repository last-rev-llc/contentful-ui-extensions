import React, { useEffect } from 'react';
import { curry } from 'lodash/fp';

import { useSDK } from '../../context';

import FormInfo from './FormInfo';
import StepList from './StepList';

import StepModal from './StepList/StepModal';
import FieldModal from './StepList/FieldModal';

import './FormBuilder.scss';
import { buildStep } from './utils';
import { useFormConfig, useFormSteps } from './hooks';

function getModal(sdk) {
  const { modal } = sdk.parameters.invocation || {};
  return modal;
}

function FormBuilder() {
  const sdk = useSDK();

  const handleFieldChange = curry((fieldName, newValue) => {
    sdk.field.setValue({
      ...sdk.field.getValue(),
      [fieldName]: newValue
    });
  });

  const formConfig = useFormConfig(handleFieldChange);
  const stepConfig = useFormSteps(handleFieldChange, [
    //
    buildStep('First step')
  ]);

  /**
   * Load the last saved state from contentful
   * We'll fill out our independant configurations from this state
   * (See above formConfig & stepConfig)
   * */
  useEffect(
    () => {
      if (sdk.field?.getValue instanceof Function) {
        const { steps = [], ...rest } = sdk.field.getValue() || {};

        if (steps.length > 0) {
          stepConfig.update(steps);
        }
        if (Object.keys(rest).length > 0) {
          formConfig.update(rest);
        }
      }
    },
    // I only actually want to update when the field changes
    // this is only initial configuration setup
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sdk.field]
  );

  switch (getModal(sdk)) {
    case 'field-modal':
      return <FieldModal />;

    case 'step-modal':
      return <StepModal />;

    default:
      break;
  }

  return (
    <div>
      <FormInfo formConfig={formConfig} />
      <StepList stepConfig={stepConfig} />
      {/* <ConfirmDeleteDialog item={removeStep} onClose={handleCancelRemoveStep} onSubmit={handleRemoveStep} /> */}
    </div>
  );
}

export default FormBuilder;
