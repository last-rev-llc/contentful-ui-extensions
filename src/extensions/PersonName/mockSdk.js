const sdk = {
  field: {
    getValue: () => ({
      salutation: "Test salutation",
      firstName: "Test firstName",
      middleName: "Test middleName",
      lastName: "Test lastName",
      suffix: "Test suffix",
      nickname: "Test nickname",
    }),
    setValue: val => val,
  },
};

export default sdk;
