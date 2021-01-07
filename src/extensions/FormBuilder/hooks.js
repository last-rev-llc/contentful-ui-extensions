import { useState } from 'react';
import { merge, curry } from 'lodash/fp';
import { v4 as uuidv4 } from 'uuid';
import arrayMove from 'array-move';

import { buildStep, buildField, URL_TYPES } from './utils';

function noop() {
  return null;
}

export function useProviderConfig({ parameters = {}, type = 'custom' } = {}, setContentfulKey = noop) {
  const { formId = '', portalId = '' } = parameters;
  const [values, setValues] = useState({ type, formId, portalId });

  return {
    ...values,

    setType: (newType) => {
      // Save to contentful
      setContentfulKey('provider.type', newType);

      setValues((oldValues) =>
        merge(oldValues)({
          type: newType,

          // Disable the URL if this type does not support it
          formId: URL_TYPES.includes(newType) ? oldValues.formId : null,
          portalId: URL_TYPES.includes(newType) ? oldValues.portalId : null
        })
      );
    },

    setFormId: (newUrl) => {
      // Save to contentful
      setContentfulKey('provider.parameters.formId', newUrl);

      setValues((oldValues) => merge(oldValues)({ formId: newUrl }));
    },

    setPortalId: (newUrl) => {
      // Save to contentful
      setContentfulKey('provider.parameters.portalId', newUrl);

      setValues((oldValues) => merge(oldValues)({ portalId: newUrl }));
    },

    update: ({ parameters: newParameters, type: newType }) =>
      setValues({
        ...values,
        ...newParameters,
        type: newType
      })
  };
}

export function useFormSteps(initialSteps = [], onChange) {
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

/**
 * We can pass in a single function (edit a step)
 * And use that function to generate a set of utility functions
 * for editing individual fields inside of that step
 * */
export function useFieldConfig(stepEdit) {
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
  const fieldAdd = curry((stepId, _event) => {
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

function ensureIds(steps) {
  return steps.map((step) => ({
    id: uuidv4(),
    ...step,
    fields: step.fields.map((field) => ({ id: uuidv4(), ...field }))
  }));
}

export function useFormConfig(handleFieldChange) {
  const formConfig = useProviderConfig({}, handleFieldChange);
  const stepConfig = useFormSteps([buildStep('First step')], handleFieldChange);

  const loadState = ({ steps = [], provider = {} }) => {
    if (steps && steps.length > 0) {
      stepConfig.stepsUpdate(ensureIds(steps), false);
    }
    if (provider && Object.keys(provider).length > 0) {
      formConfig.update(provider);
    }
  };

  return { formConfig, stepConfig, loadState };
}

export default { useFormSteps, useProviderConfig, useFormConfig };
