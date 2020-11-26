import { v4 as uuidv4 } from 'uuid';

export function buildField({ type = 'hidden', value = 'test' } = {}) {
  return {
    id: uuidv4(),
    type,
    value,
    name: 'name'
  };
}

export function buildStep(title = 'Step title') {
  return {
    title,
    id: uuidv4(),
    fields: [
      //
      buildField(),
      buildField()
    ]
  };
}

export default { buildStep };
