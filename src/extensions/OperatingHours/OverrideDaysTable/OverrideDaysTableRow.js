import React from 'react';
import PropTypes from 'prop-types';
import {
  CardActions,
  DropdownList,
  DropdownListItem,
  Switch,
  TableRow,
  TableCell,
  TextInput,
} from '@contentful/forma-36-react-components';
import { format } from 'date-fns';
import TimeRange from '../../../shared/components/TimeRange';
import TimezoneDropdown from '../../../shared/components/TimezoneDropdown';

function OverrideDaysTableRow({ id, position, value, clickEdit, clickRemove }) {
  return (
    <TableRow>
      <TableCell style={{ width: '130px' }}>
        <TextInput
          width="small"
          value={format(new Date(value.date), 'MM/d/y')}
          disabled
        />
      </TableCell>
      <TableCell style={{ width: '120px' }}>
        <TimezoneDropdown
          value={value.timezone}
          onChange={() => {}}
          disabled
          position={position}
          className="operatingHours__timezone"
        />
      </TableCell>
      <TableCell style={{ width: '90px' }}>
        <Switch
          id={`${id}-isClosed-switch`}
          labelText=""
          isChecked={value.isClosed}
          isDisabled
          className="operatingHours__isClosed"
        />
      </TableCell>
      <TableCell className="operatingHours__timeRange">
        <TimeRange
          value={value.timeRange}
          step={{ minutes: 30 }}
          disabled
        />
      </TableCell>
      <TableCell style={{ width: '40px' }}>
        <CardActions>
          <DropdownList>
            <DropdownListItem onClick={clickEdit}>
              Edit
            </DropdownListItem>
            <DropdownListItem onClick={clickRemove}>
              Remove
            </DropdownListItem>
          </DropdownList>
        </CardActions>
      </TableCell>
    </TableRow>
  );
}

OverrideDaysTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  value: PropTypes.shape({
    date: PropTypes.string,
    isClosed: PropTypes.bool,
    timezone: PropTypes.string,
    timeRange: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  clickEdit: PropTypes.func.isRequired,
  clickRemove: PropTypes.func.isRequired,
};

export default OverrideDaysTableRow;
