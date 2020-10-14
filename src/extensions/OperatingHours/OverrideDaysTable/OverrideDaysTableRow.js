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
import TimezoneDropdown from '../../../shared/components/TimezoneDropdown';

function OverrideDaysTableRow({ id, position, value, clickEdit, clickRemove }) {
  return (
    <TableRow>
      <TableCell className="operatingHours__dateTableCell">
        <TextInput
          width="small"
          value={format(new Date(value.date), 'MM/d/y')}
          disabled
        />
      </TableCell>
      <TableCell className="operatingHours__timezoneTableCell">
        <TimezoneDropdown
          value={value.timezone}
          onChange={() => {}}
          disabled
          position={position}
          className="operatingHours__timezone"
        />
      </TableCell>
      <TableCell className="operatingHours__switchTableCell">
        <Switch
          id={`${id}-isClosed-switch`}
          labelText=""
          isChecked={value.isClosed}
          isDisabled
          className="operatingHours__isClosed"
        />
      </TableCell>
      <TableCell>
        { value.timeRange.join(' - ') }
      </TableCell>
      <TableCell className="operatingHours__actionsTableCell">
        <CardActions testId={`${id}-actions`}>
          <DropdownList>
            <DropdownListItem
              onClick={clickEdit}
              testId={`${id}-edit`}>
              Edit
            </DropdownListItem>
            <DropdownListItem
              onClick={clickRemove}
              testId={`${id}-remove`}>
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
