import { v4 as uuidv4 } from 'uuid';

export function buildField({ type = 'hidden', value = 'test' } = {}) {
  return { id: uuidv4(), type, value };
}

export function buildStep(title = 'Step title') {
  return {
    title,
    fields: [
      //
      buildField(),
      buildField()
    ],
    id: uuidv4()
  };
}

export default { buildStep };
