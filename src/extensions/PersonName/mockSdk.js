const sdk = {
  field: {
    getValue: () => {
      return {
        salutation: "Test salutation",
        firstName: "Test firstName",
        middleName: "Test middleName",
        lastName: "Test lastName",
        suffix: "Test suffix",
        nickname: "Test nickname",
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
        salutation: new FakeField(),
        firstName: new FakeField(),
        middleName: new FakeField(),
        lastName: new FakeField(),
        suffix: new FakeField(),
        nickname: new FakeField(),
      },
    },
  };
}

export default sdk;
