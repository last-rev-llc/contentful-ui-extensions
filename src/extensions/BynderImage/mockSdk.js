export const mockBynderData = [
  {
    id: 12345678,
    description: "fake image description",
    name: "fake image"
  }
];

class fakeField {
  constructor() {
    this._value = "";
  }
  setValue(v) {
    this._value = v;
  }
  getValue() {
    return this._value;
  }
  onValueChanged = callback => {
    this._callback = callback;
  };
  removeValue() {
    this._value = "REMOVED";
  }
}

export function createMockSDK() {
  return {
    window: {
      startAutoResizer: () => {}
    },
    field: new fakeField(),
    entry: {
      fields: {
        bynderId: new fakeField(),
        imageName: new fakeField(),
        altText: new fakeField(),
        altTextOverride: new fakeField(),
        internalTitle: new fakeField(),
        bynderData: new fakeField()
      }
    }
  };
}
