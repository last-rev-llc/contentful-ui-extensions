const mockSdk = {
  field: {
    getValue: () => {
      return [
        {
          title: 'Step 1',
          body: 'Body 1'
        },
        {
          title: 'Step 2',
          body: 'Body 2'
        }
      ];
    },
    setValue: (value) => {
      return value;
    }
  },
  location: {
    is: () => true
  },
  parameters: {
    invocation: {
      step: {
        step: '1',
        title: 'Step 1',
        body: 'Body 1'
      }
    }
  },
  close: (value) => value
};

export const sdkList = {
  ...mockSdk,
  location: {
    is: () => false
  }
};

export default mockSdk;
