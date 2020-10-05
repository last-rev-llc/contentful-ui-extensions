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
      <TableCell>
        <TextInput
          width="small"
          value={format(value.date, 'MM/d/y')}
          disabled
        />
      </TableCell>
      <TableCell>
        <Switch
          id={`${id}-isClosed-switch`}
          labelText=""
          isChecked={value.isClosed}
          isDisabled
          className="operatingHours__isClosed"
        />
      </TableCell>
      <TableCell>
        <TimezoneDropdown
          value={value.timezone}
          disabled
          position={position}
          className="operatingHours__timezone"
        />
      </TableCell>
      <TableCell className="operatingHours__timeRange">
        <TimeRange
          value={value.timeRange}
          step={{ minutes: 30 }}
          disabled
        />
      </TableCell>
      <TableCell>
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
  value: PropTypes.shape().isRequired,
  clickEdit: PropTypes.func.isRequired,
  clickRemove: PropTypes.func.isRequired,
};

export default OverrideDaysTableRow;
