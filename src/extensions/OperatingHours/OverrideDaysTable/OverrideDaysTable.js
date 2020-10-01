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
import TimeInput from '../../../shared/components/TimeInput';

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
            <TableCell>Opening Time</TableCell>
            <TableCell>Closing Time</TableCell>
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
                  <TimeInput
                    value={overrideDay.openingTime}
                    onChange={(value) => editOverrideDay(index, { openingTime: value })}
                    disabled={overrideDay.isClosed}
                  />
                </TableCell>
                <TableCell>
                  <TimeInput
                    value={overrideDay.closingTime}
                    onChange={(value) => editOverrideDay(index, { closingTime: value })}
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
