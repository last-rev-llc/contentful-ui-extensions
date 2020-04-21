import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import FieldItem from './FieldItem';

const FieldList = ({ sdk }) => {
  const [fieldValue, setFieldValue] = useState([]);

  const renderRow = (id, key) => {
    let objectValue = '';
    if(key) {
      objectValue = fieldValue[key];
    }
    return (
      <div id="row">
        <FieldItem 
          sdk={sdk} 
          key={key} 
          objectValue={objectValue} />
      </div>
    );
  };

  return (
    <>
      {_.keys(fieldValue).map((key, i) => renderRow(i+1, key))}
    </>
  );
};

FieldList.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired
};

export default FieldList;