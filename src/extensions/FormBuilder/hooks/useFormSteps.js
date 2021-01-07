import { useState } from 'react';
import arrayMove from 'array-move';

import { buildStep } from './utils';

function noop() {
  return null;
}

export default function useFormSteps(initialSteps = [], onChange = noop) {
  const [steps, setStepsBase] = useState(initialSteps);

  const setSteps = (newValues) => {
    if (newValues instanceof Function) {
      return setStepsBase((oldValues) => {
        const toReturn = newValues(oldValues);

        // Allow us to pass in a callback function
        // Helps when we want to automatically update the steps
        if (onChange instanceof Function) {
          onChange('steps', toReturn);
        }
        return toReturn;
      });
    }

    // Allow us to pass in a callback function
    // Helps when we want to automatically update the steps
    if (onChange instanceof Function) {
      onChange('steps', newValues);
    }

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
    stepsUpdate: (newSteps, saveToContentful = false) =>
      saveToContentful ? setSteps(newSteps) : setStepsBase(newSteps)
  };
}
