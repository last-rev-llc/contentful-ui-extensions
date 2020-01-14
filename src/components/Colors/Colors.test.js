/* eslint-disable no-console */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Colors from './Colors';

const sdkMock = {
  field: {
    validations: [
      {
        in: [
          'FFFFFF',
          '000000',
          '333333'
        ]
      }
    ],
    getValue: () => {
      return 'FFFFFF';
    },
    setValue: () => {
      return null;
    }
  },
}

afterEach(() => {
  cleanup();
});


describe('<Colors />', () => {
  // Ensure the component fails correctly
  test('shows error message when sdk not present', () => {
    const { debug } = render(<Colors sdk={sdkMock} />);
    debug();
  });

  test.todo('render the same number of buttons as validations')
  test.todo('default to nothing selected if there is no value')
  test.todo('add the class active if the value matches the hex')
  test.todo('calls handleColorChange if the user onClick a button')
  test.todo('calls handleColorChange if the user onKeyDown a button')
  test.todo('changes fieldValue to the value selected')
  test.todo('changes state to the value selected')
  test.todo('initial state is the field value')
});
