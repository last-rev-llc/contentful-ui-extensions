const openDialog = (sdk, title, parameters) => {
  return sdk.dialogs.openExtension({
    width: 'large',
    title,
    allowHeightOverflow: true,
    parameters
  });
};

export default openDialog;
