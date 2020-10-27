import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CardActions,
  DropdownList,
  DropdownListItem,
  Note,
  Paragraph,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@contentful/forma-36-react-components';
import EditForm from './EditForm';

function FriendlyLabelsTable({ friendlyLabels, addRow, editRow, deleteRow }) {
  const [editRowIndex, setEditRowIndex] = useState(-1);

  function submitRowEdit(row) {
    if (editRowIndex === -1) {
      addRow(row);
      return;
    }

    editRow(editRowIndex, row);
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
      <Note
        className="operatingHours__newRowError"
        noteType="primary">
        Here you can add custom messages for the operating hours (Ex: Mon-Fri: All day). If you add a row here
        all the other filled data will be ignored.
      </Note>
      <Table
        className="operatingHours__table"
        testId="friendlyLabelsTable">
        <TableHead>
          <TableRow>
            <TableCell>Period</TableCell>
            <TableCell>Description</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody testId="friendlyLabelsTableBody">
          {
            (!friendlyLabels || friendlyLabels.length === 0) && (
              <TableRow>
                <td
                  className="operatingHours__emptyTableRow"
                  colSpan="3">
                  <Paragraph>
                    There are no friendly labels registered yet. Fill the form below to add one.
                  </Paragraph>
                </td>
              </TableRow>
            )
          }
          {
            friendlyLabels.map((friendlyLabel, index) => (
              <TableRow key={friendlyLabel.description}>
                <TableCell>{ friendlyLabel.period }</TableCell>
                <TableCell>{ friendlyLabel.description }</TableCell>
                <TableCell>
                  <CardActions testId={`friendlyLabel-${index}-actions`}>
                    <DropdownList>
                      <DropdownListItem
                        onClick={() => enterRowEditMode(index)}
                        testId={`friendlyLabel-${index}-edit`}>
                        Edit
                      </DropdownListItem>
                      <DropdownListItem
                        onClick={() => deleteRow(index)}
                        testId={`friendlyLabel-${index}-remove`}>
                        Remove
                      </DropdownListItem>
                    </DropdownList>
                  </CardActions>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <EditForm
        value={editRowIndex > -1 ? friendlyLabels[editRowIndex] : null}
        onSubmit={submitRowEdit}
        onCancel={cancelEditRow} />
    </>
  );
}

FriendlyLabelsTable.propTypes = {
  friendlyLabels: PropTypes.arrayOf(PropTypes.shape({
    period: PropTypes.string,
    description: PropTypes.string
  })).isRequired,
  addRow: PropTypes.func.isRequired,
  editRow: PropTypes.func.isRequired,
  deleteRow: PropTypes.func.isRequired
};

export default FriendlyLabelsTable;
