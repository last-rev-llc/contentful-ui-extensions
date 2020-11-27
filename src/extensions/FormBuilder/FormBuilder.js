import React, { useState } from 'react';
import { merge } from 'lodash/fp';
import SetupForm from './SetupForm';
import './FormBuilder.scss';
import { buildStep } from './utils';

function useFormConfig({ title = '', type = 'custom' }) {
  const [values, setValues] = useState({ title: '', type: 'custom' });

  return {
    type: values.type,
    title: values.title,
    setType: (newTitle) => setValues((oldValues) => merge(oldValues)({ type: newTitle })),
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

  return {
    steps,
    stepAdd,
    stepEdit,
    stepRemove
  };
}

function FormBuilder() {
  // const handleSortEnd = ({ oldIndex, newIndex }) => {
  //   setValues((prev) => ({
  //     ...prev,
  //     steps: arrayMove(prev.steps, oldIndex, newIndex)
  //   }));
  // };

  const { steps, stepAdd, stepEdit, stepRemove } = useFormSteps([
    //
    buildStep('First step'),
    buildStep('Second step')
  ]);

  return (
    <div>
      {/* <CreateForm type={values.type} title={values.title} onChange={handleChange} onSubmit={handleSubmit} /> */}
      <SetupForm
        steps={steps}
        stepAdd={stepAdd}
        stepEdit={stepEdit}
        // stepSort={handleSortEnd}
        stepRemove={stepRemove}
      />
      {/* <ConfirmDeleteDialog item={removeStep} onClose={handleCancelRemoveStep} onSubmit={handleRemoveStep} /> */}
      {/* <SetupStep step={setupStep} onClose={handleCloseSetupStep} onSubmit={handleStepSubmit} /> */}
    </div>
  );
}

export default FormBuilder;
