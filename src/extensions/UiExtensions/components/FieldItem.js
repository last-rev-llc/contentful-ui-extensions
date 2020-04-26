import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@contentful/forma-36-react-components';
import FieldProperty from './FieldProperty';

const FieldItem = ({ nameField, valueField }) => {
  const [name, setName] = useState(nameField);
  const [value, setValue] = useState(valueField);

  const onNameChange = event => {
    setName(event.currentTarget.value);
  };

  const onValueChange = event => {
    setValue(event.currentTarget.value);
  };

  let isDisabled = true;
  
  return (
    <div>
      <FieldProperty 
        nameField={name}
        valueField={value}
        onNameChange={onNameChange} 
        onValueChange={onValueChange}
        readOnly={isDisabled} />
      <Button
        buttonType="primary"
        isFullWidth={false}
        loading={false}
        onClick={() => { isDisabled = false; }}
        testId="cf-ui-button"
        type="button">
        Edit
      </Button>
      <Button
        buttonType="negative"
        isFullWidth={false}
        loading={false}
        onClick={() => {}}
        testId="cf-ui-button"
        type="button">
        -
      </Button>
    </div>
  );
};

FieldItem.propTypes = {
  nameField: PropTypes.string.isRequired, 
  valueField: PropTypes.string.isRequired
};

export default FieldItem;