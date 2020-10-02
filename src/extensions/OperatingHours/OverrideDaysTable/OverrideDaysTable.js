import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Heading,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@contentful/forma-36-react-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeRange from '../../../shared/components/TimeRange';
import TimezoneDropdown from '../../../shared/components/TimezoneDropdown';

const currentDate = new Date();

function OverrideDaysTable({ overrideDays, addOverrideDay, editOverrideDay }) {
  return (
    <>
      <Heading className="operatingHours__header">Special Dates</Heading>
      <Button
        buttonType="primary"
        onClick={addOverrideDay}
        className="operatingHours__addRowButton"
      >
        Add Special Date
      </Button>
      <Table className="operatingHours__table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Is Closed?</TableCell>
            <TableCell>Timezone</TableCell>
            <TableCell>Opening-Closing Times</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            overrideDays.map((overrideDay, index) => (
              <TableRow key={index}>
                <TableCell>
                  <DatePicker
                    selected={overrideDay.date}
                    onChange={(date) => editOverrideDay(index, { date })}
                    minDate={currentDate}
                    excludeDates={overrideDays
                      .filter((od, odIndex) => od.date && odIndex !== index)
                      .map(od => od.date)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    labelText=""
                    checked={overrideDay.isClosed}
                    onChange={(e) => editOverrideDay(index, { isClosed: e.target.checked, openingTime: null, closingTime: null })}
                  />
                </TableCell>
                <TableCell>
                  <TimezoneDropdown
                    value={overrideDay.timezone}
                    onChange={(value) => editOverrideDay(index, { timezone: value })}
                    disabled={overrideDay.isClosed}
                  />
                </TableCell>
                <TableCell>
                  <TimeRange
                    value={overrideDay.timeRange}
                    onChange={(value) => editOverrideDay(index, { timeRange: value })}
                    step={{ minutes: 30 }}
                    disabled={overrideDay.isClosed}
                  />
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </>
  );
}

OverrideDaysTable.propTypes = {
  overrideDays: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.shape(),
  })).isRequired,
  addOverrideDay: PropTypes.func.isRequired,
  editOverrideDay: PropTypes.func.isRequired,
};

export default OverrideDaysTable;
