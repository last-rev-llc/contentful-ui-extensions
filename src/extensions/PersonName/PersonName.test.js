import React from 'react';
import { render, configure, cleanup, fireEvent } from '@testing-library/react';
import PersonName from './PersonName';

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

describe('<PersonName />', () => {
  describe('when SDK field updates externally the fields are updated', () => {
    test('Initial SDK field value is set on inputs', async () => {
      const value = {
        salutation: 'Salutation',
        firstName: 'First',
        middleName: 'Middle',
        lastName: 'Last',
        suffix: 'Suffix',
        nickname: 'Nickname',
      };

      sdk.field.getValue = jest.fn(() => value);

      const { getByLabelText } = render(<PersonName sdk={sdk} />);

      expect(getByLabelText('Salutation').value).toBe(value.salutation);
      expect(getByLabelText('First Name', { exact: false }).value).toBe(value.firstName);
      expect(getByLabelText('Middle Name').value).toBe(value.middleName);
      expect(getByLabelText('LastName', { exact: false }).value).toBe(value.lastName);
      expect(getByLabelText('Suffix').value).toBe(value.suffix);
      expect(getByLabelText('Nickname').value).toBe(value.nickname);
    });
  });

  describe('change events update the SDK field', () => {
    test('SDK set value is called when updating salutation field', () => {
      const { getByLabelText } = render(<PersonName sdk={sdk} />);

      const element = getByLabelText('Salutation');

      fireEvent.change(element, {
        target: {
          value: 'Salutation'
        }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe('Salutation');
    });

    test('SDK set value is called when updating first name field', () => {
      const { getByLabelText } = render(<PersonName sdk={sdk} />);

      const element = getByLabelText('First Name', { exact: false });

      fireEvent.change(element, {
        target: {
          value: 'First'
        }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe('First');
    });

    test('SDK set value is called when updating middle name field', () => {
      const { getByLabelText } = render(<PersonName sdk={sdk} />);

      const element = getByLabelText('Middle Name');

      fireEvent.change(element, {
        target: {
          value: 'Middle'
        }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe('Middle');
    });

    test('SDK set value is called when updating Last Name field', () => {
      const { getByLabelText } = render(<PersonName sdk={sdk} />);

      const element = getByLabelText('Last Name', { exact: false });

      fireEvent.change(element, {
        target: {
          value: 'Last'
        }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe('Last');
    });

    test('SDK set value is called when updating Suffix field', () => {
      const { getByLabelText } = render(<PersonName sdk={sdk} />);

      const element = getByLabelText('Suffix');

      fireEvent.change(element, {
        target: {
          value: 'suffix'
        }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe('suffix');
    });

    test('SDK set value is called when updating Last Nickname field', () => {
      const { getByLabelText } = render(<PersonName sdk={sdk} />);

      const element = getByLabelText('Nickname');

      fireEvent.change(element, {
        target: {
          value: 'nickname'
        }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe('nickname');
    });
  });
});
