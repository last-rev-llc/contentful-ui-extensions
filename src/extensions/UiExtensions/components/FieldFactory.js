import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@contentful/forma-36-react-components';
import FieldProperty from './FieldProperty';

const FieldFactory = ({nameField, valueField, onNameChange, onValueChange, addProperty}) => {

  return (
    <div>
      <FieldProperty 
        nameField={nameField}
        valueField={valueField}
        onNameChange={onNameChange} 
        onValueChange={onValueChange}
        readOnly={false} />
      <Button
        buttonType="positive"
        isFullWidth={false}
        loading={false}
        onClick={() => addProperty(nameField, valueField)}
        testId="cf-ui-button"
        type="button">
        +
      </Button>
    </div>
  );
};

FieldFactory.propTypes = {
  nameField: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  addProperty: PropTypes.func.isRequired
};

export default FieldFactory;