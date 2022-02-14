/* eslint-disable consistent-return */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getTextInput, getTextArea } from '../helpers';
import { getButton, getBulkEditingTable } from '../../../shared/helpers/formControl';

function BulkEditSteps({ sdk }) {
  const { rows } = sdk.parameters.invocation;
  const [stepsList, setStepsList] = useState(rows);

  const headers = ['step', 'title', 'body'];

  const handleFieldChange = (event) => {
    const identifyFieldArray = event.target.id.split('-');
    const updatedArray = stepsList.map((row, index) => {
      if (index === parseInt(identifyFieldArray[0], 10)) {
        return _.set(row, identifyFieldArray[1], event.target.value);
      }
      return row;
    });
    setStepsList(updatedArray);
  };

  const getTableCell = (row, key, index) => {
    const fieldValue = _.get(row, key).toString();
    const fieldId = `${index}-${key}`;
    switch (key) {
      case 'step':
        return getTextInput(fieldValue.toString(), handleFieldChange, {
          id: fieldId,
          name: fieldId,
          type: 'number',
          labelText: null,
          className: 'bulk-step'
        });
      case 'title':
        return getTextInput(fieldValue, handleFieldChange, {
          id: fieldId,
          name: fieldId,
          labelText: null
        });
      case 'body':
        return getTextArea(fieldValue, handleFieldChange, fieldId);
      default:
        break;
    }
  };

  const submitChanges = () => {
    sdk.close(stepsList);
  };

  const cancelChanges = () => {
    sdk.close();
  };

  return (
    <div id="bulk-editing">
      {getBulkEditingTable(headers, stepsList, getTableCell, sdk)}
      <div className="action-buttons">
        {getButton('Cancel', 'muted', cancelChanges, 'cancel', 'bulk-cancel-btn')}
        {getButton('Save Items', 'positive', submitChanges, 'submit', 'bulk-submit-btn')}
      </div>
    </div>
  );
}

BulkEditSteps.propTypes = {
  sdk: PropTypes.shape({
    parameters: PropTypes.shape({
      invocation: PropTypes.shape({
        rows: PropTypes.array
      })
    }),
    close: PropTypes.func
  }).isRequired
};

export default BulkEditSteps;
