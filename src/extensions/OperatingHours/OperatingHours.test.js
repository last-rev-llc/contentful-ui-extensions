/* eslint-disable jsx-a11y/no-onchange */
import React from 'react';
import { render, configure, cleanup, fireEvent } from '@testing-library/react';
import { format } from 'date-fns';
import OperatingHours from './OperatingHours';
import mockedSdk from './mockSdk';

let sdk = null;

jest.mock('../../shared/components/DatePicker', () => ({ selected, onChange }) => {
  return (
    <input
      data-test-id="overrideDaysForm-datepicker"
      type="text"
      value={selected ? selected.toString() : ''}
      onChange={(e) => onChange(new Date(e.target.value))} />
  );
});

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
      onChange={(e) => onChange(e.target.value.split('-'))}
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

      fireEvent.click(isClosedCheckbox);

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

    test('time range change triggers sdk setValue', () => {
      const { getByTestId } = render(<OperatingHours sdk={sdk} />);

      const timeRange = getByTestId('OperatingHours-RegularHours-Monday-timeRange');

      sdk.field.setValue = jest.fn(val => val);

      fireEvent.change(timeRange, {
        target: { value: '08:00AM-08:00PM' }
      });

      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(sdk.field.setValue.mock.results[0].value.daysOfWeek[0].timeRange).toEqual(['08:00AM', '08:00PM']);
    });
  });

  describe('Special Dates tab', () => {
    test('renders the special date tab when switch tabs', () => {
      const { getByText, getByTestId } = render(<OperatingHours sdk={sdk} />);

      const specialDatesTab = getByText('Special Dates');
      fireEvent.click(specialDatesTab);

      expect(getByTestId('overrideDaysTable')).toBeDefined();
      expect(getByTestId('overrideDaysForm')).toBeDefined();
    });

    test('add a special date', () => {
      const { getByText, getByTestId } = render(<OperatingHours sdk={sdk} />);

      const specialDatesTab = getByText('Special Dates');
      fireEvent.click(specialDatesTab);

      const date = new Date();
      const timezone = 'MT';
      const timeRange = ['06:00AM', '06:00PM'];

      fireEvent.change(getByTestId('overrideDaysForm-datepicker'), {
        target: { value: date }
      });

      fireEvent.change(getByTestId('overrideDaysForm-timezone'), {
        target: { value: timezone }
      });

      fireEvent.change(getByTestId('overrideDaysForm-timeRange'), {
        target: { value: timeRange.join('-') }
      });

      sdk.field.setValue = jest.fn(val => val);

      fireEvent.click(getByTestId('overrideDaysForm-addButton'));

      expect(getByTestId('overrideDaysTableBody').childNodes.length).toBe(1);
      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(sdk.field.setValue.mock.results[0].value.overrideDays.length).toBe(1);
      expect(sdk.field.setValue.mock.results[0].value.overrideDays[0].date).toBe(format(date, 'M/d/y'));
      expect(sdk.field.setValue.mock.results[0].value.overrideDays[0].timezone).toBe(timezone);
      expect(sdk.field.setValue.mock.results[0].value.overrideDays[0].timeRange).toEqual(timeRange);
    });

    test('edit a special date', async () => {
      // Arrange
      const overrideSdk = {
        ...sdk,
        field: {
          ...sdk.field,
          getValue: () => {
            const value = sdk.field.getValue();
            return {
              ...value,
              overrideDays: [
                { date: '12/25/2020', isClosed: false, timezone: 'America/Chicago', timeRange: ['08:00AM', '06:00PM'] },
              ]
            };
          }
        }
      };

      const { getByText, getByTestId } = render(<OperatingHours sdk={overrideSdk} />);

      const specialDatesTab = getByText('Special Dates');
      fireEvent.click(specialDatesTab);

      const actionsMenu = getByTestId('OperatingHours-OverrideDays-0-actions').childNodes[0];
      fireEvent.click(actionsMenu);

      const editButton = getByTestId('OperatingHours-OverrideDays-0-edit').childNodes[0];
      fireEvent.click(editButton);

      // Act
      const date = new Date(2020, 12, 26);
      const timezone = 'PT';
      const timeRange = ['07:00AM', '07:00PM'];

      fireEvent.change(getByTestId('overrideDaysForm-datepicker'), {
        target: { value: date }
      });

      fireEvent.change(getByTestId('overrideDaysForm-timezone'), {
        target: { value: timezone }
      });

      fireEvent.change(getByTestId('overrideDaysForm-timeRange'), {
        target: { value: timeRange.join('-') }
      });

      overrideSdk.field.setValue = jest.fn(val => val);

      fireEvent.click(getByTestId('overrideDaysForm-editButton'));

      // Assert
      expect(getByTestId('overrideDaysTableBody').childNodes.length).toBe(1);
      expect(overrideSdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(overrideSdk.field.setValue.mock.results[0].value.overrideDays.length).toBe(1);
      expect(overrideSdk.field.setValue.mock.results[0].value.overrideDays[0].date).toBe(format(date, 'M/d/y'));
      expect(overrideSdk.field.setValue.mock.results[0].value.overrideDays[0].timezone).toBe(timezone);
      expect(overrideSdk.field.setValue.mock.results[0].value.overrideDays[0].timeRange).toEqual(timeRange);
    });

    test('remove a special date', async () => {
      // Arrange
      const overrideSdk = {
        ...sdk,
        field: {
          ...sdk.field,
          getValue: () => {
            const value = sdk.field.getValue();
            return {
              ...value,
              overrideDays: [
                { date: '12/25/2020', isClosed: false, timezone: 'America/Chicago', timeRange: ['08:00AM', '06:00PM'] },
                { date: '12/26/2020', isClosed: false, timezone: 'America/Chicago', timeRange: ['08:00AM', '06:00PM'] },
                { date: '12/27/2020', isClosed: false, timezone: 'America/Chicago', timeRange: ['08:00AM', '06:00PM'] },
              ]
            };
          }
        }
      };

      const { getByText, getByTestId } = render(<OperatingHours sdk={overrideSdk} />);

      const specialDatesTab = getByText('Special Dates');
      fireEvent.click(specialDatesTab);

      const actionsMenu = getByTestId('OperatingHours-OverrideDays-1-actions').childNodes[0];
      fireEvent.click(actionsMenu);

      overrideSdk.field.setValue = jest.fn(val => val);

      // Act
      const removeButton = getByTestId('OperatingHours-OverrideDays-1-remove').childNodes[0];
      fireEvent.click(removeButton);


      // Assert
      expect(getByTestId('overrideDaysTableBody').childNodes.length).toBe(2);
      expect(overrideSdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(overrideSdk.field.setValue.mock.results[0].value.overrideDays.length).toBe(2);
      expect(overrideSdk.field.setValue.mock.results[0].value.overrideDays.map(od => od.date)).not.toContain('12/26/2020');
    });
  });

  describe('Friendly Labels tab', () => {
    test('renders the friendly labels tab when switch tabs', () => {
      const { getByText, getByTestId } = render(<OperatingHours sdk={sdk} />);

      const friendlyLabelsTab = getByText('Friendly Labels');
      fireEvent.click(friendlyLabelsTab);

      expect(getByTestId('friendlyLabelsTable')).toBeDefined();
      expect(getByTestId('friendlyLabelsForm')).toBeDefined();
    });

    test('add a friendly label', () => {
      const { getByText, getByTestId, getByLabelText } = render(<OperatingHours sdk={sdk} />);

      const friendlyLabelsTab = getByText('Friendly Labels');
      fireEvent.click(friendlyLabelsTab);

      const period = 'Mon-Fri';
      const description = 'All day';

      fireEvent.change(getByLabelText('Period', { exact: false }), {
        target: { value: period }
      });

      fireEvent.change(getByLabelText('Description', { exact: false }), {
        target: { value: description }
      });

      sdk.field.setValue = jest.fn(val => val);

      fireEvent.click(getByTestId('friendlyLabelsForm-addButton'));

      expect(getByTestId('friendlyLabelsTableBody').childNodes.length).toBe(1);
      expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(sdk.field.setValue.mock.results[0].value.friendlyLabels.length).toBe(1);
      expect(sdk.field.setValue.mock.results[0].value.friendlyLabels[0].period).toBe(period);
      expect(sdk.field.setValue.mock.results[0].value.friendlyLabels[0].description).toBe(description);
    });

    test('edit a friendly label', async () => {
      // Arrange
      const overrideSdk = {
        ...sdk,
        field: {
          ...sdk.field,
          getValue: () => {
            const value = sdk.field.getValue();
            return {
              ...value,
              friendlyLabels: [
                { period: 'Mon-Fri', description: 'All day' },
              ]
            };
          }
        }
      };

      const { getByText, getByTestId, getByLabelText } = render(<OperatingHours sdk={overrideSdk} />);

      const friendlyLabelsTab = getByText('Friendly Labels');
      fireEvent.click(friendlyLabelsTab);

      const actionsMenu = getByTestId('friendlyLabel-0-actions').childNodes[0];
      fireEvent.click(actionsMenu);

      const editButton = getByTestId('friendlyLabel-0-edit').childNodes[0];
      fireEvent.click(editButton);

      // Act
      const period = 'Weekdays';
      const description = '24h';

      fireEvent.change(getByLabelText('Period', { exact: false }), {
        target: { value: period }
      });

      fireEvent.change(getByLabelText('Description', { exact: false }), {
        target: { value: description }
      });

      overrideSdk.field.setValue = jest.fn(val => val);

      fireEvent.click(getByTestId('friendlyLabelsForm-editButton'));

      // Assert
      expect(getByTestId('friendlyLabelsTableBody').childNodes.length).toBe(1);
      expect(overrideSdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(overrideSdk.field.setValue.mock.results[0].value.friendlyLabels.length).toBe(1);
      expect(overrideSdk.field.setValue.mock.results[0].value.friendlyLabels[0].period).toBe(period);
      expect(overrideSdk.field.setValue.mock.results[0].value.friendlyLabels[0].description).toBe(description);
    });

    test('remove a friendly label', async () => {
      // Arrange
      const overrideSdk = {
        ...sdk,
        field: {
          ...sdk.field,
          getValue: () => {
            const value = sdk.field.getValue();
            return {
              ...value,
              friendlyLabels: [
                { period: 'Mon/Wed/Frid', description: '8am-8pm' },
                { period: 'Tue/Thu', description: '9am-6pm' },
                { period: 'Weekends and Holidays', description: 'Closed' },
              ]
            };
          }
        }
      };

      const { getByText, getByTestId } = render(<OperatingHours sdk={overrideSdk} />);

      const friendlyLabelsTab = getByText('Friendly Labels');
      fireEvent.click(friendlyLabelsTab);

      const actionsMenu = getByTestId('friendlyLabel-1-actions').childNodes[0];
      fireEvent.click(actionsMenu);

      overrideSdk.field.setValue = jest.fn(val => val);

      // Act
      const removeButton = getByTestId('friendlyLabel-1-remove').childNodes[0];
      fireEvent.click(removeButton);

      // Assert
      expect(getByTestId('friendlyLabelsTableBody').childNodes.length).toBe(2);
      expect(overrideSdk.field.setValue).toHaveBeenCalledTimes(1);
      expect(overrideSdk.field.setValue.mock.results[0].value.friendlyLabels.map(l => l.period)).not.toContain('Tue/Thu');
    });
  });
});
