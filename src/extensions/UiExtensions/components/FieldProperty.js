import React from 'react';
import PropTypes from 'prop-types';
import NameField from './NameField';
import ValueField from './ValueField';

const FieldProperty = ({ nameField, valueField, onNameChange, onValueChange, readOnly }) => {
  
  return (
    <div>
      <NameField 
        nameField={nameField}
        onNameChange={onNameChange} 
        readOnly={readOnly} />
      :
      <ValueField 
        valueField={valueField}
        onValueChange={onValueChange} />
    </div>
  );
};

FieldProperty.propTypes = {
  nameField: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired
};

export default FieldProperty;