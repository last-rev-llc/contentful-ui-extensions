const sdk = {
  field: {
    getValue: () => {
      return {
        label: "Test Label",
        phoneNumber: "5555555555",
        extension: "1234",
      };
    },
    setValue: (value) => {
      return value;
    },
  },
};

export default sdk;
