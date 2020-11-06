const mockSdk = {
  field: {
    getValue: () => {
      return {
        "key1": "value1",
        "key2": "value2",
        "key3": "value3",
        "key4": "value4",
        "key5": "value5",
      };
    },
    setValue: value => {
      return value;
    }
  },
};

export default mockSdk;