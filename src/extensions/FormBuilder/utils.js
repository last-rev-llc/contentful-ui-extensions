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

export default { showModal, safeParse };
