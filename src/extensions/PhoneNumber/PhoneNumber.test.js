import React from 'react';
import { render, configure, cleanup, fireEvent } from '@testing-library/react';
import PhoneNumber from './PhoneNumber';

let sdk = null;

configure({
  testIdAttribute: 'data-test-id',
});

beforeEach(() => {
  sdk = {
    field: {
      getValue: () => ({}),
      setValue: jest.fn(val => val),
    },
  };
});

afterEach(() => {
  cleanup();
});

describe('<PhoneNumber />', () => {
  describe('when SDK field updates externally the fields are updated', () => {
    test('Initial SDK field value is set on inputs', async () => {
      const value = {
        label: 'Phone Label',
        phoneNumber: '1234567890',
        extension: '1234',
      };

      sdk.field.getValue = jest.fn(() => value);

      const { getByLabelText } = render(<PhoneNumber sdk={sdk} />);

      expect(getByLabelText('Label').value).toBe(value.label);
      expect(getByLabelText('Phone Number', { exact: false }).value).toBe(value.phoneNumber);
      expect(getByLabelText('Extension').value).toBe(value.extension);
    });
  });

  describe('change events update the SDK field', () => {
    test('SDK set value is called when updating label field', () => {
      const { getByLabelText } = render(<PhoneNumber sdk={sdk} />);

      const element = getByLabelText('Label');

      const TEST_VALUE = 'Phone Test Label';

      fireEvent.change(element, {
        target: {
          value: TEST_VALUE
        }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(TEST_VALUE);
    });

    test('SDK set value is called when updating phone number field', () => {
      const { getByLabelText } = render(<PhoneNumber sdk={sdk} />);

      const element = getByLabelText('Phone Number', { exact: false });

      const TEST_VALUE = '5555555555';

      fireEvent.change(element, {
        target: {
          value: TEST_VALUE
        }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(TEST_VALUE);
    });

    test('SDK set value is called when updating extension field', () => {
      const { getByLabelText } = render(<PhoneNumber sdk={sdk} />);

      const element = getByLabelText('Extension');

      const TEST_VALUE = '123';

      fireEvent.change(element, {
        target: {
          value: TEST_VALUE
        }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(TEST_VALUE);
    });
  });
});