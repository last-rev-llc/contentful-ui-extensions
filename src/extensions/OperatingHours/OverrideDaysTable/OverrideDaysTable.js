import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paragraph,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@contentful/forma-36-react-components';
import RowEditForm from './RowEditForm';
import OverrideDaysTableRow from './OverrideDaysTableRow';

function OverrideDaysTable({ overrideDays, addOverrideDay, editOverrideDay, deleteOverrideDay }) {
  const [editRowIndex, setEditRowIndex] = useState(-1);

  function submitRowEdit(row) {
    if (!row.date) {
      throw Error('The Date field is required. Please fill it before submit.');
    }

    if (editRowIndex === -1) {
      addOverrideDay(row);
      return;
    }

    editOverrideDay(editRowIndex, row);
    setEditRowIndex(-1);
  }

  function enterRowEditMode(rowIndex) {
    setEditRowIndex(rowIndex);
  }

  function cancelEditRow() {
    setEditRowIndex(-1);
  }

  return (
    <>
      <Table className="operatingHours__table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Closed?</TableCell>
            <TableCell>Timezone</TableCell>
            <TableCell>Open/Close Times</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {
            (!overrideDays || overrideDays.length === 0) && (
              <TableRow>
                <td
                  className="operatingHours__emptyTableRow"
                  colSpan="5">
                  <Paragraph>
                    There are no special dates registered yet. Fill the form below to add one.
                  </Paragraph>
                </td>
              </TableRow>
            )
          }
          {
            overrideDays.map((overrideDay, index) => (
              <OverrideDaysTableRow
                key={overrideDay.date.toString()}
                id={`OperatingHours-OverrideDays-${index}`}
                position={index.toString()}
                disabled
                value={overrideDay}
                clickEdit={() => enterRowEditMode(index)}
                clickRemove={() => deleteOverrideDay(index)} />
            ))
          }
        </TableBody>
      </Table>
      <RowEditForm
        value={editRowIndex > -1 ? overrideDays[editRowIndex] : null}
        onSubmit={submitRowEdit}
        onCancel={cancelEditRow}
        alreadySelectedDates={overrideDays.map(od => od.date).filter((od, i) => editRowIndex !== i)} />
    </>
  );
}

OverrideDaysTable.propTypes = {
  overrideDays: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.shape(),
  })).isRequired,
  addOverrideDay: PropTypes.func.isRequired,
  editOverrideDay: PropTypes.func.isRequired,
  deleteOverrideDay: PropTypes.func.isRequired,
};

export default OverrideDaysTable;
