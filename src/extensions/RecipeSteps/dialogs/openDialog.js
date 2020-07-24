const openDialog = (sdk, title, parameters) => {
  return sdk.dialogs.openExtension({
    width: 'fullWidth',
    title,
    allowHeightOverflow: true,
    parameters
  });
};

export default openDialog;