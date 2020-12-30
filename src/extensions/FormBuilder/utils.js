import { v4 as uuidv4 } from 'uuid';

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

export const showModal = (sdk, modalProps = {}, parameters = {}) => {
  const { width = 'fullWidth', name } = modalProps;

  return sdk.dialogs.openExtension({
    width,
    id: sdk.ids.extension,
    allowHeightOverflow: false,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    position: 'center',
    parameters: {
      modal: name,
      ...parameters
    }
  });
};

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

export const URL_TYPES = ['hubspot'];

export default { buildStep, URL_TYPES };
