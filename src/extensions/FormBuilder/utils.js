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

export const showModal = curry((sdk, modalProps = {}, parameters) => {
  const { width = 800, name } = modalProps;

  return sdk.dialogs.openExtension({
    width,
    id: sdk.ids.extension,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    position: 'center',
    parameters: {
      modal: name,
      ...parameters
    }
  });
});

export function buildField({ name = 'no_name', type = 'hidden' } = {}) {
  return {
    id: uuidv4(),
    type,
    name
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
