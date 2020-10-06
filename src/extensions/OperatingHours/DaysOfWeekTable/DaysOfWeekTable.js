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
            <TableCell>Timezone</TableCell>
            <TableCell>Closed?</TableCell>
            <TableCell>Open/Close Times</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            daysOfWeek.map((dayOfWeek, index) => (
              <TableRow key={dayOfWeek.dayOfWeek}>
                <TableCell style={{ width: '130px' }}>{ dayOfWeek.dayOfWeek }</TableCell>
                <TableCell style={{ width: '120px' }}>
                  <TimezoneDropdown
                    id={`${dayOfWeek.dayOfWeek}-timezone`}
                    value={dayOfWeek.timezone}
                    onChange={(e) => onChange(index, { timezone: e.currentTarget.value })}
                    position={`line-${index}`}
                    className="operatingHours__timezone" />
                </TableCell>
                <TableCell
                  style={{ width: '90px' }}
                  testId={`OperatingHours-RegularHours-${dayOfWeek.dayOfWeek}-isClosed`}>
                  <Switch
                    id={`OperatingHours-RegularHours-${dayOfWeek.dayOfWeek}-isClosed-switch`}
                    labelText=""
                    isChecked={dayOfWeek.isClosed}
                    onToggle={(isChecked) => onChange(index, { isClosed: isChecked })} />
                </TableCell>
                <TableCell
                  className="operatingHours__timeRange">
                  <TimeRange
                    testId={`OperatingHours-RegularHours-${dayOfWeek.dayOfWeek}-timeRange`}
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
