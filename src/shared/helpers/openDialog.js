const openDialog = (sdk, title, parameters, width = 'large', allowHeightOverflow = true) => {
  return sdk.dialogs.openExtension({
    width,
    title,
    allowHeightOverflow,
    parameters
  });
};

export default openDialog;
