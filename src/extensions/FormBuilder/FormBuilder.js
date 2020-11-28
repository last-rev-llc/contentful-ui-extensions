import React, { useState } from 'react';
import { merge } from 'lodash/fp';
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

function useFormConfig({ title = '', type = 'custom' } = {}) {
  const [values, setValues] = useState({ title: '', type: 'custom' });

  return {
    type: values.type,
    title: values.title,
    setType: (newType) => setValues((oldValues) => merge(oldValues)({ type: newType })),
    setTitle: (newTitle) => setValues((oldValues) => merge(oldValues)({ title: newTitle }))
  };
}

function useFormSteps(initialSteps = []) {
  const [steps, setSteps] = useState(initialSteps);

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
    stepReorder
  };
}

function FormBuilder() {
  const sdk = useSDK();

  const formConfig = useFormConfig();
  const stepConfig = useFormSteps([
    //
    buildStep('First step'),
    buildStep('Second step')
  ]);

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
