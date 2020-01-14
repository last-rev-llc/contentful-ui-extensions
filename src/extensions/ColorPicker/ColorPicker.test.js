/* eslint-disable no-console */
import React from 'react';
import _ from 'lodash';
import { render, cleanup, fireEvent } from '@testing-library/react';
import ColorPicker from './ColorPicker';

const SDK_MOCK = {
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


describe('<ColorPicker />', () => {
  // Ensure the component fails correctly
  test.todo('shows error message when sdk not present');

  test('buttons have the required attributes', () => {
    const { container } = render(<ColorPicker sdk={SDK_MOCK} />);
    const button = container.firstChild.querySelector('button');
    expect(button.getAttribute('type'))
      .toEqual('button');
    expect(button.getAttribute('data-hex'))
      .not.toBeNull();
  });

  test('render the same number of buttons as validations', () => {
    const { getAllByTestId } = render(<ColorPicker sdk={SDK_MOCK} />);
    expect(getAllByTestId('ColorPicker-button').length)
      .toBe(SDK_MOCK.field.validations[0].in.length);
  });

  test('add the class active if the value matches the hex', () => {
    const { container } = render(<ColorPicker sdk={SDK_MOCK} />);
    expect(container.firstChild.querySelectorAll('.active').length)
      .toBe(1);
    expect(container.firstChild.querySelector('.active').getAttribute('data-hex'))
      .toEqual(SDK_MOCK.field.getValue())
  });

  test('no button with active class if there is not a value for the field', () => {
    const sdk = {
      field: {
        ...SDK_MOCK.field,
        getValue: () => '',
      }
    };
    const { container } = render(<ColorPicker sdk={sdk} />);
    expect(container.firstChild.querySelectorAll('.active').length)
      .toBe(0);
  })

  test('adds active class to correct button on click event', () => {
    const handleColorChange = jest.fn();
    const sdk = {
      field: {
        ...SDK_MOCK.field,
        setValue: handleColorChange,
      }
    };
    const { container, getAllByTestId } = render(<ColorPicker sdk={sdk} />);
    
    fireEvent.click(getAllByTestId('ColorPicker-button')[1]);
    expect(handleColorChange)
      .toBeCalledTimes(1);
    expect(container.firstChild.querySelectorAll('.active').length)
      .toBe(1);
    expect(container.firstChild.querySelector('.active')
      .getAttribute('data-hex'))
      .toEqual(sdk.field.validations[0].in[1]);
  });

  test('adds active class to correct button on keydown event', () => {
    const handleColorChange = jest.fn();
    const sdk = {
      field: {
        ...SDK_MOCK.field,
        setValue: handleColorChange,
      }
    };
    const { container, getAllByTestId } = render(<ColorPicker sdk={sdk} />);
    
    fireEvent.keyDown(getAllByTestId('ColorPicker-button')[1]);
    expect(handleColorChange)
      .toBeCalledTimes(1);
    expect(container.firstChild.querySelectorAll('.active').length)
      .toBe(1);
    expect(container.firstChild.querySelector('.active')
      .getAttribute('data-hex'))
      .toEqual(sdk.field.validations[0].in[1]);
  });
});
