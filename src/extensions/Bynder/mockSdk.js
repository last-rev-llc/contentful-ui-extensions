const mockSdk = {
  dialogs: {
    openExtension: () => {}
  },
  field: {
    getValue: () => {},
    setValue: val => val
  },
  location: {
    is: () => false
  }
};

export default mockSdk;
