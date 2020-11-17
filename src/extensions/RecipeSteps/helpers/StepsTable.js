/* eslint-disable react/forbid-prop-types */

import React, { useState } from 'react';
import { merge } from 'lodash/fp';
import PropTypes from 'prop-types';
import { Table, TableHead, TableBody, TextInput } from '@contentful/forma-36-react-components';

import { getStepRows } from './formControl';
import { getIconButton } from '../../../shared/helpers';
import { sortedKeys } from './helpers';

import { HeaderRowStyle, HeaderCellStyle, HeaderActionsStyle } from './styles';

function useEditable(defaultValue = '') {
  const [isEditing, setEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return [isEditing, setEditing, value, setValue];
}

function TableHeaderCell({ children, colRemove, isEditing, setEditing, setFieldName }) {
  const canEdit = ['title', 'step'].includes(children) === false;

  if (canEdit && isEditing)
    return (
      <HeaderCellStyle $canEdit={isEditing}>
        <div>
          <TextInput defaultValue={children} onChange={(e) => setFieldName(children, e.currentTarget.value)} />
          {getIconButton('Cancel', 'primary', 'CheckCircle', 'medium', () => setEditing(false))}
        </div>
      </HeaderCellStyle>
    );

  return (
    <HeaderCellStyle $canEdit={canEdit}>
      <div>
        {children}
        {canEdit && getIconButton('Cancel', 'negative', 'Delete', 'small', () => colRemove(children))}
      </div>
    </HeaderCellStyle>
  );
}
TableHeaderCell.propTypes = {
  children: PropTypes.node.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setEditing: PropTypes.func.isRequired,
  setFieldName: PropTypes.func.isRequired,
  colRemove: PropTypes.func.isRequired
};

function HeaderActionsCell({ colAdd, colEdit, fieldNames, setEditing, isEditing }) {
  const [isAdding, setAdding, text, setText] = useEditable('');

  const cancel = () => {
    setText('');
    setAdding(false);
  };

  /**
   * When we're editing all the header fields at once
   * we'll show a check circle which when clicked updates
   * all the field names. See the parent for controller
   */
  if (isEditing) {
    return (
      <HeaderActionsStyle>
        {getIconButton('Cancel', 'primary', 'CheckCircle', 'medium', () => {
          Object.entries(fieldNames).forEach(([oldName, newName]) =>
            // Rename each of the old field name to be the new field name
            colEdit(oldName, newName)
          );
          setEditing(false);
        })}
      </HeaderActionsStyle>
    );
  }

  if (isAdding) {
    return (
      <HeaderActionsStyle>
        <TextInput value={text} onChange={(e) => setText(e.currentTarget.value)} />
        {getIconButton('Cancel', 'primary', 'CheckCircle', 'medium', () => {
          colAdd(text);
          cancel();
        })}
        {getIconButton('Cancel', 'negative', 'Delete', 'medium', cancel)}
      </HeaderActionsStyle>
    );
  }

  return (
    <HeaderActionsStyle className="col-actions">
      {getIconButton('Cancel', 'primary', 'Edit', 'medium', () => setEditing(true))}
      {getIconButton('Add a column', 'primary', 'PlusCircle', 'medium', () => setAdding(true))}
    </HeaderActionsStyle>
  );
}

HeaderActionsCell.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  setEditing: PropTypes.func.isRequired,
  colAdd: PropTypes.func.isRequired,
  colEdit: PropTypes.func.isRequired,
  fieldNames: PropTypes.object.isRequired
};

function StepsTable({ steps, colAdd, colEdit, colRemove, edit, remove }) {
  /**
   * Control the header editable state
   * When editing each header will be replaced by an input field
   */
  const [isEditing, setEditing, fieldNames, setFieldNames] = useEditable({});

  const setFieldName = (oldFieldName, newFieldName) => {
    setFieldNames(merge(fieldNames, { [oldFieldName]: newFieldName }));
  };

  return steps.length === 0 ? null : (
    <>
      <Table className="steps-table">
        <TableHead isSticky>
          <HeaderRowStyle>
            {sortedKeys(steps[0]).map((title) => (
              <TableHeaderCell
                key={title}
                colRemove={colRemove}
                isEditing={isEditing}
                setEditing={setEditing}
                setFieldName={setFieldName}>
                {title}
              </TableHeaderCell>
            ))}
            <HeaderActionsCell
              colAdd={colAdd}
              colEdit={colEdit}
              fieldNames={fieldNames}
              setEditing={setEditing}
              isEditing={isEditing}
            />
          </HeaderRowStyle>
        </TableHead>
        <TableBody>{getStepRows(steps, edit, remove)}</TableBody>
      </Table>
    </>
  );
}

StepsTable.propTypes = {
  edit: PropTypes.func.isRequired,
  colAdd: PropTypes.func.isRequired,
  colEdit: PropTypes.func.isRequired,
  colRemove: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  steps: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default StepsTable;
