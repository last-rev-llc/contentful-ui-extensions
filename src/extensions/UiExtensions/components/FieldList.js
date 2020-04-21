import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FieldItem from './FieldItem';

const FieldList = ({ sdk }) => {
  const [fieldValue, setFieldValue] = useState({});

  return (
    <div id="row">
      <FieldItem sdk={sdk} />
    </div>
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