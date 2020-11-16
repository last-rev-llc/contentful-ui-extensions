const sdk = {
  field: {
    getValue: () => ({
      internalTitle: "Some title",
      linkText: "Some link name",
      action: "window_same",
      destination: "reference_asset",
      manualUrl: "https://google.com",
      contentReference: "Some content name",
      target: "_blank",
      icon: "none",
      style: "none"
    }),
    setValue: val => val
  }
};

export default sdk;
