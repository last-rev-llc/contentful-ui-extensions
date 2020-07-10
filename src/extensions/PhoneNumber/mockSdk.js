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

class FakeField {
  constructor() {
    this._value = "";
  }

  setValue(v) {
    this._value = v;
  }

  getValue() {
    return this._value;
  }

  onValueChanged = (callback) => {
    this._callback = callback;
  };

  removeValue() {
    this._value = "REMOVED";
  }
}

export function createMockSDK() {
  return {
    window: {
      startAutoResizer: () => {},
    },
    field: new FakeField(),
    entry: {
      fields: {
        label: new FakeField(),
        phoneNumber: new FakeField(),
        extension: new FakeField(),
      },
    },
  };
}

export default sdk;
