import { v4 as uuidv4 } from 'uuid';
import { curry } from 'lodash/fp';

export const showModal = curry((sdk, modalName, parameters) =>
  sdk.dialogs.openExtension({
    width: 500,
    id: sdk.ids.extension,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    position: 'center',
    parameters: {
      modal: modalName,
      ...parameters
    }
  })
);

export function buildField({ name = 'name', type = 'hidden', value = 'test' } = {}) {
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
      buildField({ name: 'First field' }),
      buildField({ name: 'Second field' })
    ]
  };
}

export default { buildStep };
