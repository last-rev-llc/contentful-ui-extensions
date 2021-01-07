import arrayMove from 'array-move';

import { buildStep } from './utils';

/**
 * Pass in a set of JSON steps and we'll generate a set of functionality
 * surrounding editing or reordering those steps
 *
 * We rely on the parent components state here so this function will use the onChange
 * callback to update that.
 *
 * onChange should be a function which takes a string<key> and a <value>
 * onChange('some.maybe.deep.key', someValue)
 * */
export default function useFormSteps(onChange, { steps = [] } = {}) {
  const stepsUpdate = (newValues) => {
    if (newValues instanceof Function) {
      onChange('steps', newValues(steps));
      return;
    }

    onChange('steps', newValues);
  };

  const stepAdd = () =>
    stepsUpdate((oldSteps) =>
      // Generate a new empty step
      oldSteps.concat(buildStep(`New Step ${steps.length + 1}`))
    );

  const stepRemove = ({ id: idToRemove }) =>
    // Filter out old step by ID
    stepsUpdate((oldSteps) => oldSteps.filter(({ id }) => id !== idToRemove));

  const stepEdit = (stepId, stepUpdates) =>
    stepsUpdate((oldSteps) =>
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
    stepsUpdate((oldSteps) => arrayMove(oldSteps, oldIndex, newIndex));

  return {
    stepAdd,
    stepEdit,
    stepRemove,
    stepReorder,
    stepsUpdate
  };
}
