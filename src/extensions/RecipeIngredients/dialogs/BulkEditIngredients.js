import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getTextInput, getSelect } from '../helpers';
import { getTextField, getButton, getBulkEditingTable } from '../../../shared/helpers/formControl';
import { imperialUnits, metricUnits } from '../helpers/selectValues';

function BulkEditIngredients({ sdk }) {
  const { rows } = sdk.parameters.invocation;
  const [ingredientList, setIngredientList] = useState(rows);

  const headers = _.keys(ingredientList[0]);

  const handleFieldChange = (event) => {
    const identifyFieldArray = event.target.id.split('-');
    const udpatedArray = ingredientList.map((row, index) => {
      if (index === parseInt(identifyFieldArray[0], 10)) {
        return _.set(row, identifyFieldArray[1], event.target.value);
      }
      return row;
    });
    setIngredientList(udpatedArray);
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
      case 'ingredient':
        return getTextInput(fieldValue, handleFieldChange, {
          id: fieldId,
          name: fieldId,
          labelText: null
        });
      case 'imperialMeasure':
        return getSelect(imperialUnits, handleFieldChange, { id: fieldId }, fieldValue);
      case 'metricMeasure':
        return getSelect(metricUnits, handleFieldChange, { id: fieldId }, fieldValue);
      case 'imperialQuantity':
        return getTextInput(fieldValue, handleFieldChange, {
          id: fieldId,
          name: fieldId,
          type: 'number',
          labelText: null
        });
      case 'metricQuantity':
        return getTextInput(fieldValue, handleFieldChange, {
          id: fieldId,
          name: fieldId,
          type: 'number',
          labelText: null
        });
      default:
        break;
    }
    return getTextField(_.get(row, key), handleFieldChange, '', {
      id: key
    });
  };

  const submitChanges = () => {
    sdk.close(ingredientList);
  };

  const cancelChanges = () => {
    sdk.close();
  };

  return (
    <div id="bulk-editing">
      {getBulkEditingTable(headers, ingredientList, getTableCell, sdk)}
      <div className="action-buttons">
        {getButton('Cancel', 'muted', cancelChanges, 'cancel', 'bulk-cancel-btn')}
        {getButton('Save Items', 'positive', submitChanges, 'submit', 'bulk-submit-btn')}
      </div>
    </div>
  );
}

BulkEditIngredients.propTypes = {
  sdk: PropTypes.shape({
    parameters: PropTypes.shape({
      invocation: PropTypes.shape({
        rows: PropTypes.array
      })
    }),
    close: PropTypes.func
  }).isRequired
};

export default BulkEditIngredients;
