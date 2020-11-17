import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Table, TableHead, TableBody, TableCell, TableRow, TextInput } from '@contentful/forma-36-react-components';

import { getStepRows } from './formControl';
import { getIconButton } from '../../../shared/helpers';
import { sortedKeys } from './helpers';

function addHoverEditEffect({ canEdit }) {
  if (!canEdit) return '';

  return `
  &:hover {
    > div {
      // Remove hidden svg padding
      padding-right: 0;
    }

    svg {
      display: block;
    }
  }
`;
}

const TableHeaderStyle = styled(TableCell)`
  text-transform: capitalize;

  > div {
    display: flex;
    align-items: center;

    // Padding for hidden svg
    padding-right: 18px;
  }

  svg {
    display: none;
  }

  ${addHoverEditEffect}
`;

const AddColStyle = styled(TableCell)`
  display: flex;
  flex-direction: row;

  input {
    max-height: 21px;
    min-width: 80px;
  }
`;

function TableHeader({ children, colRemove }) {
  const canEdit = ['title', 'step'].includes(children) === false;

  return (
    <TableHeaderStyle canEdit={canEdit}>
      <div>
        {children}
        {canEdit && getIconButton('Cancel', 'negative', 'Delete', 'small', () => colRemove(children))}
      </div>
    </TableHeaderStyle>
  );
}
TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
  colRemove: PropTypes.func.isRequired
};

function AddColHeader({ add }) {
  const [isEditCol, setEditCol] = useState(false);
  const [textValue, setText] = useState('');

  const cancelEdit = () => {
    setText('');
    setEditCol(false);
  };

  if (isEditCol) {
    return (
      <AddColStyle className="col-actions">
        <TextInput value={textValue} onChange={(e) => setText(e.currentTarget.value)} />
        {getIconButton('Cancel', 'primary', 'CheckCircle', 'medium', () => {
          add(textValue);
          cancelEdit();
        })}
        {getIconButton('Cancel', 'negative', 'Delete', 'medium', cancelEdit)}
      </AddColStyle>
    );
  }

  return (
    <AddColStyle className="col-actions">
      {getIconButton('Add a column', 'primary', 'PlusCircle', 'medium', () => setEditCol(true))}
    </AddColStyle>
  );
}

AddColHeader.propTypes = {
  add: PropTypes.func.isRequired
};

function StepsTable({ steps, colAdd, colRemove, edit, remove }) {
  return steps.length === 0 ? null : (
    <>
      <Table className="steps-table">
        <TableHead isSticky>
          <TableRow>
            {sortedKeys(steps[0]).map((title) => (
              <TableHeader key={title} colRemove={colRemove}>
                {title}
              </TableHeader>
            ))}
            <AddColHeader add={colAdd} />
          </TableRow>
        </TableHead>
        <TableBody>{getStepRows(steps, edit, remove)}</TableBody>
      </Table>
    </>
  );
}

StepsTable.propTypes = {
  edit: PropTypes.func.isRequired,
  colAdd: PropTypes.func.isRequired,
  colRemove: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  steps: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default StepsTable;
