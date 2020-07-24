const sdk = {
  field: {
    getValue: () => {
      return [
        {
          'title': 'Step 1',
          'body': 'Body 1',
        }, {
          'title': 'Step 2',
          'body': 'Body 2',
        }
      ];
    },
    setValue: value => {
      return value;
    }
  },
  location: {
    is: () => true
  },
  parameters: {
    invocation: {
      step: null
    }
  },
  close: (value) => value
};

export default sdk;

export const sdkList = { ...sdk, location: { is: () => false } };