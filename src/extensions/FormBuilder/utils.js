import { v4 as uuidv4 } from 'uuid';
import { curry } from 'lodash/fp';

export function safeParse(maybeJson) {
  let parsed;
  try {
    parsed = JSON.parse(maybeJson);

    // We don't need to save empty dependsOn
    if (Object.keys(parsed).length < 1) {
      return undefined;
    }

    return parsed;
  } catch (error) {
    // pass

    return undefined;
  }
}

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

export function buildField({ name = 'no_name', type = 'hidden', defaultValue = '' } = {}) {
  return {
    id: uuidv4(),
    type,
    name,
    defaultValue
  };
}

export function buildStep(title = 'Step title') {
  return {
    title,
    id: uuidv4(),
    fields: [
      //
      buildField({ name: 'First field' })
    ]
  };
}

export const URL_TYPES = ['hubspot'];

export default { buildStep, URL_TYPES };
