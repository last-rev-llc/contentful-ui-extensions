import { v4 as uuidv4 } from 'uuid';

export function ensureIds(steps) {
  return steps.map((step) => ({
    id: uuidv4(),
    ...step,
    fields: step.fields.map((field) => ({ id: uuidv4(), ...field }))
  }));
}

export function buildField({ name = 'no_name', type = 'hidden', value = false } = {}) {
  return {
    id: uuidv4(),
    type,
    name,
    value
  };
}

export function buildStep(title = 'Step title') {
  return {
    title,
    id: uuidv4(),
    fields: [
      //
      buildField({ name: 'first_field' })
    ]
  };
}

export const URL_TYPES = ['hubspot', 'redirect'];

export default {
  URL_TYPES,
  buildStep,
  buildField,
  ensureIds
};
