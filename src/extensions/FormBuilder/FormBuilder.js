import React, { useState, useEffect } from 'react';
import { curry, merge } from 'lodash/fp';
import arrayMove from 'array-move';

import { useSDK } from '../../context';

import FormInfo from './FormInfo';
import StepList from './StepList';

import StepModal from './StepList/StepModal';
import FieldModal from './StepList/FieldModal';

import './FormBuilder.scss';
import { buildStep } from './utils';

function getModal(sdk) {
  const { modal } = sdk.parameters.invocation || {};
  return modal;
}

function useFormConfig(handleFieldChange, { title = '', type = 'custom' } = {}) {
  const [values, setValues] = useState({ title, type });

  return {
    type: values.type,
    title: values.title,
    setType: (newType) => {
      handleFieldChange('type', newType);
      setValues((oldValues) => merge(oldValues)({ type: newType }));
    },
    setTitle: (newTitle) => {
      handleFieldChange('title', newTitle);
      setValues((oldValues) => merge(oldValues)({ title: newTitle }));
    },
    update: (updates) => setValues({ ...values, ...updates })
  };
}

function useFormSteps(handleFieldChange, initialSteps = []) {
  const [steps, setStepsBase] = useState(initialSteps);

  const setSteps = (newValues) => {
    if (newValues instanceof Function) {
      return setStepsBase((oldValues) => {
        const toReturn = newValues(oldValues);
        handleFieldChange('steps', toReturn);
        return toReturn;
      });
    }

    handleFieldChange('steps', newValues);
    return setStepsBase(newValues);
  };

  const stepAdd = () =>
    setSteps((oldSteps) =>
      // Generate a new empty step
      oldSteps.concat(buildStep(`New Step ${steps.length + 1}`))
    );

  const stepRemove = ({ id: idToRemove }) =>
    // Filter out old step by ID
    setSteps((oldSteps) => oldSteps.filter(({ id }) => id !== idToRemove));

  const stepEdit = (stepId, stepUpdates) =>
    setSteps((oldSteps) =>
      oldSteps.map((step) => {
        // If matching ID found replace the step, else return old step
        // We should pass the entire new step here to update
        if (step.id !== stepId) return step;

        // Allow the user to specify their own step updater function
        if (stepUpdates instanceof Function) {
          return stepUpdates(step);
        }

        // User has simply passed us an object to replace the step with
        return stepUpdates;
      })
    );

  const stepReorder = ({ oldIndex, newIndex }) =>
    // Move the item to position requested
    setSteps((oldSteps) => arrayMove(oldSteps, oldIndex, newIndex));

  return {
    steps,
    stepAdd,
    stepEdit,
    stepRemove,
    stepReorder,
    update: setSteps
  };
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
      {/* <SetupStep step={setupStep} onClose={handleCloseSetupStep} onSubmit={handleStepSubmit} /> */}
    </div>
  );
}

export default FormBuilder;
