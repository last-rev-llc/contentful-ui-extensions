const sdk = {
  field: {
    validations: [
      {
        in: [
          '#FFFFFF',
          '#000000',
          '#333333'
        ]
      }
    ],
    getValue: () => {
      return '#FFFFFF';
    },
    setValue: () => {
      return null;
    }
  },
};

export default sdk;