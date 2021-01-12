const mockSdk = {
  field: {
    getValue: () => {
      return {
        "en-US": "9876543210",
        "de-DE": "1234567890",
      };
    },
    setValue: (value) => {
      return value;
    },
  },
  locales: {
    names: {
      "en-US": "English (United States)",
      "es-MX": "Spanish (Mexico)",
      fr: "French",
      "de-DE": "German (Germany)",
    },
  },
  dialogs: {
    openConfirm: async () => true,
  },
};

export default mockSdk;
