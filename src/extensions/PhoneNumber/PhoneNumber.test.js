import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { fireEvent } from "@testing-library/dom";
import PhoneNumber from './PhoneNumber';
import { createMockSDK } from "./mockSdk";

afterEach(() => {
  cleanup();
});

describe('<PhoneNumber />', () => {

  const sdk = createMockSDK();

  // Ensure the component fails correctly
  test.todo('shows error message when sdk not present');
  const container = render(<PhoneNumber sdk={sdk} />);

//   it("should update its internal field when the text field changes", () => {
//     const textField = container.getByTestId("phoneNumberLabel");
//     // console.log(textField);
//     const changeValue = "Label";
//     fireEvent.change(textField, { target: { value: changeValue } });
    
//     expect(sdk.field._value).toEqual(changeValue);
//   });

  // Doesn't do anything.  Need a quick tutorial on how these tests are supposed to work.
//   test('Getting a container.  Needs to do something with this', () => {
    
    // console.log(container);
    // expect(container.firstChild.querySelectorAll('.active').length)
    //   .toBe(1);
    // expect(container.firstChild.querySelector('.active').getAttribute('data-hex'))
    //   .toEqual(sdk.field.getValue());
//   });

});
