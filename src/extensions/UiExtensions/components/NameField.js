import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@contentful/forma-36-react-components';

const NameField = ({ sdk, isDisabled }) => {
  
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
        disabled={isDisabled}
        id="keyName"
        name="keyName"
        onChange={event => onInputChange(event)}
        required={false}
        testId="cf-ui-text-input-key-name"
        value={fieldValue}
        width="medium" />
    </div>
  );
};

NameField.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    })
  }).isRequired,
  isDisabled: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired
  }).isRequired
};

export default NameField;