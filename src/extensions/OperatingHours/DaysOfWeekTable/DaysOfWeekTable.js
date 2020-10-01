import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Heading,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@contentful/forma-36-react-components';
import TimeInput from '../../../shared/components/TimeInput';

function DaysOfWeekTable({ daysOfWeek, onChange }) {
  return (
    <>
      <Heading className="operatingHours__header">Regular Hours</Heading>
      <Table className="operatingHours__table">
        <TableHead>
          <TableRow>
            <TableCell>Day of Week</TableCell>
            <TableCell>Is Closed?</TableCell>
            <TableCell>Opening Time</TableCell>
            <TableCell>Closing Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            daysOfWeek.map((dayOfWeek, index) => (
              <TableRow key={dayOfWeek.dayOfWeek}>
                <TableCell>{ dayOfWeek.dayOfWeek }</TableCell>
                <TableCell data-test-id={`OperatingHours-RegularHours-${dayOfWeek.dayOfWeek}-isClosed`}>
                  <Checkbox
                    labelText=""
                    checked={dayOfWeek.isClosed}
                    onChange={(e) => onChange(index, { isClosed: e.target.checked, openingTime: null, closingTime: null })}
                  />
                </TableCell>
                <TableCell data-test-id={`OperatingHours-RegularHours-${dayOfWeek.dayOfWeek}-openingTime`}>
                  <TimeInput
                    value={dayOfWeek.openingTime}
                    onChange={(value) => onChange(index, { openingTime: value })}
                    disabled={dayOfWeek.isClosed}
                  />
                </TableCell>
                <TableCell data-test-id={`OperatingHours-RegularHours-${dayOfWeek.dayOfWeek}-closingTime`}>
                  <TimeInput
                    value={dayOfWeek.closingTime}
                    onChange={(value) => onChange(index, { closingTime: value })}
                    disabled={dayOfWeek.isClosed}
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

DaysOfWeekTable.propTypes = {
  daysOfWeek: PropTypes.arrayOf(PropTypes.shape({
    dayOfWeek: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DaysOfWeekTable;
