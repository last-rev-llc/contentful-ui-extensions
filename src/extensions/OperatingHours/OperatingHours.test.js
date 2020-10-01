import React from 'react';
import { render, configure, cleanup, fireEvent } from '@testing-library/react';
import OperatingHours from './OperatingHours';
import mockedSdk from './mockSdk';

const renderComponent = (sdk = mockedSdk) => render(<OperatingHours sdk={sdk} />);

configure({
  testIdAttribute: 'data-test-id',
});

afterEach(() => {
  cleanup();
});

describe('<OperatingHours />', () => {
  describe('Regular Hours table', () => {
    test('renders one row for each day of the week', () => {
      const { getByText } = renderComponent();
  
      expect(getByText('Monday', { selector: 'td' })).toBeDefined();
      expect(getByText('Tuesday', { selector: 'td' })).toBeDefined();
      expect(getByText('Wednesday', { selector: 'td' })).toBeDefined();
      expect(getByText('Thursday', { selector: 'td' })).toBeDefined();
      expect(getByText('Friday', { selector: 'td' })).toBeDefined();
      expect(getByText('Saturday', { selector: 'td' })).toBeDefined();
      expect(getByText('Sunday', { selector: 'td' })).toBeDefined();
    });
  
    test('isClosed, openingTime and closingTime fields should be enabled', () => {
      const { getByTestId } = renderComponent();

      const isClosedCheckbox = getByTestId('OperatingHours-RegularHours-Monday-isClosed').firstChild;
      const openingTimeTimePicker = getByTestId('OperatingHours-RegularHours-Monday-openingTime').querySelector('input[type="number"]');
      const closingTimeTimePicker = getByTestId('OperatingHours-RegularHours-Monday-closingTime').querySelector('input[type="number"]');

      expect(isClosedCheckbox.getAttribute('disabled')).toBeNull();
      expect(openingTimeTimePicker.getAttribute('disabled')).toBeNull();
      expect(closingTimeTimePicker.getAttribute('disabled')).toBeNull();
    });

    test('when isClosed is checked, then openingTime and closingTime should be disabled', () => {
      const { getByTestId } = renderComponent();

      const isClosedCheckbox = getByTestId('OperatingHours-RegularHours-Monday-isClosed').firstChild;

      fireEvent(isClosedCheckbox, new Event('click'));

      const openingTimeTimePicker = getByTestId('OperatingHours-RegularHours-Monday-openingTime').querySelector('input[type="number"]');
      const closingTimeTimePicker = getByTestId('OperatingHours-RegularHours-Monday-closingTime').querySelector('input[type="number"]');

      expect(openingTimeTimePicker.getAttribute('disabled')).toBeDefined();
      expect(closingTimeTimePicker.getAttribute('disabled')).toBeDefined();
    });
  });
});