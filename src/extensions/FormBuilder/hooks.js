import { useState } from 'react';
import { merge } from 'lodash/fp';
import arrayMove from 'array-move';

import { buildStep, URL_TYPES } from './utils';

export function useFormConfig(handleFieldChange, { title = '', type = 'custom' } = {}) {
  const [values, setValues] = useState({ title, type });

  return {
    url: values.url,
    type: values.type,
    title: values.title,
    setType: (newType) => {
      handleFieldChange('type', newType);
      setValues((oldValues) =>
        merge(oldValues)({
          type: newType,

          // Disable the URL if this type does not support it
          url: URL_TYPES.includes(newType) ? oldValues.url : undefined
        })
      );
    },
    setUrl: (newUrl) => {
      handleFieldChange('url', newUrl);
      setValues((oldValues) => merge(oldValues)({ url: newUrl }));
    },
    setTitle: (newTitle) => {
      handleFieldChange('title', newTitle);
      setValues((oldValues) => merge(oldValues)({ title: newTitle }));
    },
    update: (updates) => setValues({ ...values, ...updates })
  };
}

export function useFormSteps(handleFieldChange, initialSteps = []) {
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

export default { useFormSteps, useFormConfig };
