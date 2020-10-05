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
            <TableCell>Closed?</TableCell>
            <TableCell>Timezone</TableCell>
            <TableCell>Open/Close Times</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            daysOfWeek.map((dayOfWeek, index) => (
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
                    onChange={(e) => onChange(index, { timezone: e.currentTarget.value })}
                    disabled={dayOfWeek.isClosed}
                    position={`line-${index}`}
                    className="operatingHours__timezone" />
                </TableCell>
                <TableCell
                  data-test-id={`OperatingHours-RegularHours-${dayOfWeek.dayOfWeek}-timeRange`}
                  className="operatingHours__timeRange">
                  <TimeRange
                    value={dayOfWeek.timeRange}
                    onChange={(value) => onChange(index, { timeRange: value })}
                    step={{ minutes: 30 }}
                    disabled={dayOfWeek.isClosed} />
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
