import React from "react";
import { mockBynderData, createMockSDK } from "./mockSdk";
import BynderImage, { setIfEmpty } from "./BynderImage";
import { fireEvent } from "@testing-library/dom";
import { cleanup, render, rerender } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

describe("<BynderImage />", () => {
  const sdk = createMockSDK();
  const container = render(<BynderImage sdk={sdk} />);
  it("should update its internal field when the text field changes", () => {
    const textField = container.getByTestId("bynderImageTestId");
    const changeValue = "11223344";
    fireEvent.change(textField, { target: { value: changeValue } });
    expect(sdk.field._value).toEqual(changeValue);
  });
  it("should on mounting listen for bynder image changes", () => {
    expect(typeof sdk.entry.fields["bynderData"]._callback).toBe("function");
  });
  it("should remove a value if the type field is empty", () => {
    const container = render(<BynderImage sdk={sdk} />);
    const textField = container.getByTestId("bynderImageTestId");
    const changeValue = null;
    fireEvent.change(textField, { target: { value: changeValue } });
    expect(sdk.field._value).toEqual("REMOVED");
  });
  it("should update the fields when the Bynder Image is changed externally", () => {
    sdk.entry.fields["bynderData"]._callback(mockBynderData);
    expect(sdk.entry.fields["bynderId"]._value).toEqual(mockBynderData[0].id);
    expect(sdk.entry.fields["imageName"]._value).toEqual(
      mockBynderData[0].name
    );
    expect(sdk.entry.fields["altText"]._value).toEqual(
      mockBynderData[0].description
    );
    expect(sdk.entry.fields["internalTitle"]._value).toEqual(
      mockBynderData[0].name
    );
    expect(sdk.entry.fields["altTextOverride"]._value).toEqual(
      mockBynderData[0].description
    );
  });
});

describe("setIfEmpty", () => {
  const sdk = createMockSDK();
  it("should only update a field if it doesn't have a value set'", () => {
    const fieldId = "internalTitle";
    setIfEmpty(sdk, fieldId, "set this value");
    expect(sdk.entry.fields[fieldId].getValue()).toEqual("set this value");
    setIfEmpty(sdk, fieldId, "don't set this value");
    expect(sdk.entry.fields[fieldId].getValue()).toEqual("set this value");
  });
});
