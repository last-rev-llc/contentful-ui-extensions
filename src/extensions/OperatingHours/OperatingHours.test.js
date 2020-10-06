/* eslint-disable jsx-a11y/no-onchange */
import React from 'react';
import { render, configure, cleanup, fireEvent } from '@testing-library/react';
import OperatingHours from './OperatingHours';
import mockedSdk from './mockSdk';

let sdk = null;

jest.mock('../../shared/components/TimezoneDropdown', () => ({ id, value, onChange }) => {
  return (
    <select
      data-test-id={id}
      value={value}
      onChange={onChange}>
      <option value="ET">ET</option>
      <option value="CT">CT</option>
      <option value="MT">CT</option>
      <option value="PT">PT</option>
    </select>
  );
});

jest.mock('../../shared/components/TimeRange', () => ({ testId, value, onChange, disabled }) => {
  return (
    <input
      data-test-id={testId}
      type="text"
      value={value.join('-')}
      onChange={(val) => onChange(val.split('-'))}
      disabled={disabled} />
  );
});

configure({
  testIdAttribute: 'data-test-id',
});

beforeEach(() => {
  sdk = {
    field: {
      getValue: mockedSdk.field.getValue,
      setValue: jest.fn(val => val),
    },
  };
});

afterEach(() => {
  cleanup();
});

describe('<OperatingHours />', () => {
  test('renders the tabs', () => {
    const { getByText } = render(<OperatingHours sdk={sdk} />);

    expect(getByText('Regular Hours')).toBeDefined();
    expect(getByText('Special Dates')).toBeDefined();
    expect(getByText('Friendly Labels')).toBeDefined();
  });

  test('Regular Hours tab is selected by default', () => {
    const { getByText } = render(<OperatingHours sdk={sdk} />);

    expect(getByText('Day of Week', { selector: 'th' })).toBeDefined();
  });

  describe('Regular Hours tab', () => {
    test('renders one row for each day of the week', () => {
      const { getByText } = render(<OperatingHours sdk={sdk} />);
  
      expect(getByText('Monday', { selector: 'td' })).toBeDefined();
      expect(getByText('Tuesday', { selector: 'td' })).toBeDefined();
      expect(getByText('Wednesday', { selector: 'td' })).toBeDefined();
      expect(getByText('Thursday', { selector: 'td' })).toBeDefined();
      expect(getByText('Friday', { selector: 'td' })).toBeDefined();
      expect(getByText('Saturday', { selector: 'td' })).toBeDefined();
      expect(getByText('Sunday', { selector: 'td' })).toBeDefined();
    });
  
    test('timezone, isClosed and time range fields should be enabled', () => {
      const { getByTestId } = render(<OperatingHours sdk={sdk} />);

      const timezoneDropdown = getByTestId('Monday-timezone');
      const isClosedCheckbox = getByTestId('OperatingHours-RegularHours-Monday-isClosed').querySelector('input[type="checkbox"]');
      const timeRangeField = getByTestId('OperatingHours-RegularHours-Monday-timeRange');

      expect(timezoneDropdown.getAttribute('disabled')).toBeNull();
      expect(isClosedCheckbox.getAttribute('disabled')).toBeNull();
      expect(timeRangeField.getAttribute('disabled')).toBeNull();
    });

    test('when isClosed is checked, then the time range field is disabled', () => {
      const { getByTestId } = render(<OperatingHours sdk={sdk} />);

      const isClosedCheckbox = getByTestId('OperatingHours-RegularHours-Monday-isClosed').firstChild;

      fireEvent(isClosedCheckbox, new Event('click'));

      const timeRangeField = getByTestId('OperatingHours-RegularHours-Monday-timeRange');

      expect(timeRangeField.getAttribute('disabled')).toBeDefined();
    });

    test('timezone change triggers sdk setValue', () => {
      const { getByTestId } = render(<OperatingHours sdk={sdk} />);

      const timezoneDropdown = getByTestId('Monday-timezone');

      sdk.field.setValue = jest.fn(val => val);

      fireEvent.change(timezoneDropdown, {
        target: { value: 'MT' }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(sdk.field.setValue.mock.results[0].value.daysOfWeek[0].timezone).toBe('MT');
    });

    // test('time range change triggers sdk setValue', () => {
    //   const { getByTestId } = render(<OperatingHours sdk={sdk} />);

    //   const timeRange = getByTestId('OperatingHours-RegularHours-Monday-timeRange');

    //   sdk.field.setValue = jest.fn(val => val);

    //   const value = '08:00AM-08:00PM';

    //   fireEvent.change(timeRange, {
    //     target: { value }
    //   });

    //   expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
    //   expect(sdk.field.setValue.mock.results[0].value.daysOfWeek[0].timeRange).toBe(value);
    // });
  });

  describe('Special Dates tab', () => {
  });
});