import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button } from '@contentful/forma-36-react-components';
// import FieldProperty from './FieldProperty';

const FieldItem = ({ sdk, jsonObject, setJsonObject, nameField, valueField, onDelete, onEditSave, fieldProperty }) => {
  const [name, setName] = useState(nameField);
  const [value, setValue] = useState(valueField);
  const [isDisabled, setIsDisabled] = useState(true);
  const [oldName, setOldName] = useState(nameField);

  const onNameChange = event => {
    setName(event.currentTarget.value);
  };

  const onValueChange = event => {
    const newValue = {
      ...jsonObject,
      [name]: event.currentTarget.value
    };
    sdk.field.setValue(newValue);
    setJsonObject(newValue);
    setValue(event.currentTarget.value);
  };

  const buttonStyle = {
    marginTop: '-3px'
  };
  
  return isDisabled ? (
    <div>
      <div className="d-inline-block">
        {fieldProperty(name, value, onNameChange, onValueChange, isDisabled)}
        {/* <FieldProperty 
          nameField={name}
          valueField={value}
          onNameChange={onNameChange} 
          onValueChange={onValueChange}
          readOnly={isDisabled} /> */}
      </div>
      <div className="d-inline-block ml-3">
        <Button
          style={buttonStyle}
          buttonType="primary"
          isFullWidth={false}
          loading={false}
          onClick={() => setIsDisabled(false)}
          testId="cf-ui-button"
          type="button">
          Edit
        </Button>
      </div>
      <div className="d-inline-block ml-1">
        <Button
          style={buttonStyle}
          buttonType="negative"
          isFullWidth={false}
          loading={false}
          onClick={() => onDelete(name, setOldName)}
          testId="cf-ui-button"
          type="button">
          {name}
        </Button>
      </div>
    </div>
  ) : (
    <div>
      <div className="d-inline-block">
        {fieldProperty(name, value, onNameChange, onValueChange, isDisabled)}
        {/* <FieldProperty 
          nameField={name}
          valueField={value}
          onNameChange={onNameChange} 
          onValueChange={onValueChange}
          readOnly={isDisabled} /> */}
      </div>
      <div className="d-inline-block ml-3">
        <Button
          style={buttonStyle}
          buttonType="primary"
          isFullWidth={false}
          loading={false}
          onClick={() => onEditSave(name, value, oldName, setOldName, setIsDisabled)}
          testId="cf-ui-button"
          type="button">
          Save
        </Button>
      </div>
    </div>
  );
};

FieldItem.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired,
  jsonObject: PropTypes.object.isRequired,
  setJsonObject: PropTypes.func.isRequired,
  nameField: PropTypes.string.isRequired, 
  valueField: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditSave: PropTypes.func.isRequired,
  fieldProperty: PropTypes.func.isRequired
};

export default FieldItem;