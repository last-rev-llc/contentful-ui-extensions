const sdk = {
  field: {
    validations: [
      {
        in: [
          '#BBBBBB',
          '#000000',
          '#333333'
        ]
      }
    ],
    getValue: () => {
      return '#BBBBBB';
    },
    setValue: () => {
      return null;
    }
  },
  location: 'LOCATION_APP',
  parameters: {
    installation: {
      animal: 'dog',
    }
  },

};

export default sdk;