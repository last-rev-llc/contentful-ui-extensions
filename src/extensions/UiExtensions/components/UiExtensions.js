import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FieldFactory from './FieldFactory';
import FieldList from './FieldList';

const UiExtensions = ({ sdk }) => {
  const [fieldValue, setFieldValue] = useState({});
  

  // Sets the intial state value on component load to the Contentful value
  useEffect(() => {
    if(sdk.field.getValue()) {
      setFieldValue(sdk.field.getValue());
    }
  }, [sdk.field]);

  return (
    <>
      <FieldFactory sdk={sdk} />
      <FieldList sdk={sdk} />
    </>
  );
  
};


UiExtensions.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired
};

export default UiExtensions;

