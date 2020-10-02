import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@contentful/forma-36-react-components';
import TimeRange from '../../../shared/components/TimeRange';
import TimezoneDropdown from '../../../shared/components/TimezoneDropdown';

function DaysOfWeekTable({ daysOfWeek, onChange }) {
  return (
    <>
      <Table className="operatingHours__table">
        <TableHead>
          <TableRow>
            <TableCell>Day of Week</TableCell>
            <TableCell>Is Closed?</TableCell>
            <TableCell>Timezone</TableCell>
            <TableCell>Opening-Closing Times</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            daysOfWeek.map((dayOfWeek, index) => {
              return (
                <TableRow key={dayOfWeek.dayOfWeek}>
                  <TableCell>{ dayOfWeek.dayOfWeek }</TableCell>
                  <TableCell data-test-id={`OperatingHours-RegularHours-${dayOfWeek.dayOfWeek}-isClosed`}>
                    <Switch
                      id={`OperatingHours-RegularHours-${dayOfWeek.dayOfWeek}-isClosed-switch`}
                      labelText=""
                      isChecked={dayOfWeek.isClosed}
                      onToggle={(isChecked) => onChange(index, { isClosed: isChecked })}
                    />
                  </TableCell>
                  <TableCell>
                    <TimezoneDropdown
                      value={dayOfWeek.timezone}
                      onChange={(timezone) => onChange(index, { timezone })}
                      disabled={dayOfWeek.isClosed}
                    />
                  </TableCell>
                  <TableCell
                    data-test-id={`OperatingHours-RegularHours-${dayOfWeek.dayOfWeek}-openingTime`}
                    className="operatingHours__timeRange"
                  >
                    <TimeRange
                      value={dayOfWeek.timeRange}
                      onChange={(value) => onChange(index, { timeRange: value })}
                      step={{ minutes: 30 }}
                      disabled={dayOfWeek.isClosed}
                    />
                  </TableCell>
                </TableRow>
              )
            })
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
