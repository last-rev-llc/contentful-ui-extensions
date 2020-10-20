const sdk = {
  field: {
    getValue: () => ({
      displayText: "",
      displaySummary: "",
      streetAddress: "",
      streetAddress2: "",
      city: "",
      state: "",
      postalCode: "",
      latitude: "",
      longitude: "",
      googlePlacesId: ""
    }),
    setValue: val => val,
  },
};

export default sdk;
