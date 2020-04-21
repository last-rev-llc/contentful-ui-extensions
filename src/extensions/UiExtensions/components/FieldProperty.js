import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import NameField from './NameField';
import ValueField from './ValueField';

const FieldProperty = ({ sdk }) => {
  
  const [fieldValue, setFieldValue] = useState(null);
  // Sets the intial state value on component load to the Contentful value
  // useEffect(() => {
  //   if(sdk.field.getValue()) {
  //     setFieldValue(sdk.field.getValue());
  //   }
  // }, [sdk.field]);

  return (
    <div>
      <NameField 
        sdk={sdk} 
        isDisabled={false} />
      :
      <ValueField 
        sdk={sdk} />
    </div>
  );
};

FieldProperty.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired
};

export default FieldProperty;