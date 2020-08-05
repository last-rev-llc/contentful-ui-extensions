const mockSdk = {
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
};

export default mockSdk;
