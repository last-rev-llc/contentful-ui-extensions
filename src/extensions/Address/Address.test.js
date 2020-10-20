import React from 'react';
import { render, configure, cleanup, fireEvent } from '@testing-library/react';
import Address from './Address';

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

describe('<Address />', () => {
  describe('when SDK field updates externally the fields are updated', () => {
    test('Initial SDK field value is set on inputs', async () => {
      const value = {
        displayText: 'display text',
        displaySummary: 'display summary',
        streetAddress: 'street address',
        streetAddress2: 'street address 2',
        city: 'Denver',
        state: 'CO',
        postalCode: '00000',
        latitude: '00000',
        longitude: '00000',
        googlePlacesId: 'aaaa'
      };

      sdk.field.getValue = jest.fn(() => value);

      const { getByLabelText } = render(<Address sdk={sdk} />);

      expect(getByLabelText('Display Text').value).toBe(value.displayText);
      expect(getByLabelText('Display Summary').value).toBe(value.displaySummary);
      expect(getByLabelText('Street Address 1', { exact: false }).value).toBe(value.streetAddress);
      expect(getByLabelText('Street Address 2').value).toBe(value.streetAddress2);
      expect(getByLabelText('City', { exact: false }).value).toBe(value.city);
      expect(getByLabelText('State', { exact: false }).value).toBe(value.state);
      expect(getByLabelText('Postal Code', { exact: false }).value).toBe(value.postalCode);
      expect(getByLabelText('Latitude').value).toBe(value.latitude);
      expect(getByLabelText('Longitude').value).toBe(value.longitude);
      expect(getByLabelText('Google Places Id').value).toBe(value.googlePlacesId);
    });
  });

  describe('change events update the SDK field', () => {
    test('SDK set value is called when updating Display Text', () => {
      const { getByLabelText } = render(<Address sdk={sdk} />);

      const element = getByLabelText('Display Text');
      const value = 'test display text';

      fireEvent.change(element, {
        target: { value }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(value);
    });

    test('SDK set value is called when updating Display Summary', () => {
      const { getByLabelText } = render(<Address sdk={sdk} />);

      const element = getByLabelText('Display Summary');
      const value = 'test display summary';

      fireEvent.change(element, {
        target: { value }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(value);
    });

    test('SDK set value is called when updating Street Address 1', () => {
      const { getByLabelText } = render(<Address sdk={sdk} />);

      const element = getByLabelText('Street Address 1', { exact: false });
      const value = 'street address';

      fireEvent.change(element, {
        target: { value }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(value);
    });

    test('SDK set value is called when updating Street Address 2', () => {
      const { getByLabelText } = render(<Address sdk={sdk} />);

      const element = getByLabelText('Street Address 2');
      const value = 'street address 2';

      fireEvent.change(element, {
        target: { value }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(value);
    });

    test('SDK set value is called when updating City', () => {
      const { getByLabelText } = render(<Address sdk={sdk} />);

      const element = getByLabelText('City', { exact: false });
      const value = 'city';

      fireEvent.change(element, {
        target: { value }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(value);
    });

    test('SDK set value is called when updating State', () => {
      const { getByLabelText } = render(<Address sdk={sdk} />);

      const element = getByLabelText('State', { exact: false });
      const value = 'NY';

      fireEvent.change(element, {
        target: { value }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(value);
    });

    test('SDK set value is called when updating Postal Code', () => {
      const { getByLabelText } = render(<Address sdk={sdk} />);

      const element = getByLabelText('Postal Code', { exact: false });
      const value = '12345';

      fireEvent.change(element, {
        target: { value }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(value);
    });

    test('SDK set value is called when updating Latitude', () => {
      const { getByLabelText } = render(<Address sdk={sdk} />);

      const element = getByLabelText('Latitude');
      const value = '12345';

      fireEvent.change(element, {
        target: { value }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(value);
    });

    test('SDK set value is called when updating Longitude', () => {
      const { getByLabelText } = render(<Address sdk={sdk} />);

      const element = getByLabelText('Longitude');
      const value = '12345';

      fireEvent.change(element, {
        target: { value }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(value);
    });

    test('SDK set value is called when updating Google Places Id', () => {
      const { getByLabelText } = render(<Address sdk={sdk} />);

      const element = getByLabelText('Google Places Id');
      const value = '12345';

      fireEvent.change(element, {
        target: { value }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(element.value).toBe(value);
    });
  });
});