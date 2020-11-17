const mockSdk = {
  field: {
    validations: [
      {
        in: ['#BBBBBB', '#000000', '#333333']
      }
    ],
    getValue: () => {
      return '#BBBBBB';
    },
    setValue: () => {
      return null;
    }
  }
};

export default mockSdk;
