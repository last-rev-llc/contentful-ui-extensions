import React from 'react';
import _ from 'lodash';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@contentful/forma-36-react-components';

const getTableRow = (row, index, getTableCell) => {
  return (
    <TableRow>
      {_.keys(row).map((key) => {
        return <TableCell>{getTableCell(row, key, index)}</TableCell>;
      })}
    </TableRow>
  );
};

const getBulkEditingTable = (headers, rows, getTableCell) => {
  return (
    <div id="bulk-editing">
      <p>
        This view allows you to edit all fields in one window. <br />
        <strong>Important: Please use the Save Changes button at the bottom.</strong> If you close this window without
        saving, your changes will be lost!{' '}
      </p>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((v) => {
              return <TableCell>{v}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            return getTableRow(row, index, getTableCell);
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default getBulkEditingTable;
