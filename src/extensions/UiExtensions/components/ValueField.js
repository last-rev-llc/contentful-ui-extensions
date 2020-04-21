import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@contentful/forma-36-react-components';

const ValueField = ({ sdk }) => {
  
  const [fieldValue, setFieldValue] = useState(null);
  // Sets the intial state value on component load to the Contentful value
  // useEffect(() => {
  //   if(sdk.field.getValue()) {
  //     setFieldValue(sdk.field.getValue());
  //   }
  // }, [sdk.field]);

  const onInputChange = event => {
    sdk.field.setValue(event.currentTarget.value);
    setFieldValue(event.currentTarget.value);
  };

  return (
    <div>
      <TextInput
        className=""
        id="keyValue"
        name="keyValue"
        onChange={event => onInputChange(event)}
        required={false}
        testId="cf-ui-text-input-key-value"
        value={fieldValue}
        width="medium" />
    </div>
  );
};

ValueField.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    })
  }).isRequired
};

export default ValueField;