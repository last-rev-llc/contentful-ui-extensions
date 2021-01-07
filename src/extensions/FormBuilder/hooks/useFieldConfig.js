import { curry } from 'lodash/fp';
import arrayMove from 'array-move';

import { buildField } from './utils';

/**
 * We can pass in a single function (edit a step)
 * And use that function to generate a set of utility functions
 * for editing individual fields inside of that step
 * */
export default function useFieldConfig(stepEdit) {
  const fieldRemove = curry((stepId, field) =>
    stepEdit(
      stepId,

      // Filter out the step
      // we're passing a function to stepEdit which will give us
      // the latest version of the step (actomic update)
      (oldStep) => ({
        ...oldStep,
        fields: oldStep.fields.filter(({ id: fieldId }) => fieldId !== field.id)
      })
    )
  );

  // We want to keep this function curried so we
  // must provide a second argument (for lodash)
  // eslint-disable-next-line no-unused-vars
  const fieldAdd = curry((stepId) => {
    stepEdit(stepId, (oldStep) => ({
      ...oldStep,
      fields: oldStep.fields.concat(buildField())
    }));
  });

  const fieldEdit = curry((stepId, newField) => {
    stepEdit(stepId, (oldStep) => ({
      ...oldStep,
      fields: oldStep.fields.map((field) => (field.id === newField.id ? newField : field))
    }));
  });

  const fieldReorder = curry((stepId, { oldIndex, newIndex }) => {
    // Move the item to position requested
    stepEdit(stepId, (step) => ({ ...step, fields: arrayMove(step.fields, oldIndex, newIndex) }));
  });

  return {
    fieldAdd,
    fieldRemove,
    fieldEdit,
    fieldReorder
  };
}
