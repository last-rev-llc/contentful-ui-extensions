import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TextInput, Button } from '@contentful/forma-36-react-components';
import { updateJson, hasDuplicate } from '../../shared/helpers';

const buttonStyle = {
  marginTop: '-3px'
};

export const uniqueErrorMessage = 'This Name has already been added. Please change the Name to add field.';
export const nameRequiredErrorMessage = 'At least one character is required for the Name field.';

export const renderError = (error, message, position) => {
  return error ? (
    <div 
      className="alert alert-danger"
      data-test-id={`error-${position}`}>
      {message}
    </div>
  ) : null;
};

export const renderButton = (label, buttonType, onClick, position) => {
  return <Button
    style={buttonStyle}
    buttonType={buttonType}
    isFullWidth={false}
    loading={false}
    onClick={onClick}
    testId={`cf-ui-button-${label}-${position}`}
    type="button">
    {label}
  </Button>;
};

export const renderNameField = (nameField, onNameChange, readOnly, position) => {
  return (
    <div>
      <TextInput
        className=""
        disabled={readOnly}
        id="keyName"
        name="keyName"
        placeholder="Name"
        onChange={event => onNameChange(event)}
        required
        testId={`cf-ui-text-input-key-name-${position}`}
        value={nameField}
        width="medium" />
    </div>
  );
};

export const renderValueField = (valueField, onValueChange, position) => {
  return (
    <div>
      <TextInput
        className=""
        id="keyValue"
        name="keyValue"
        placeholder="Value"
        onChange={event => onValueChange(event)}
        required={false}
        testId={`cf-ui-text-input-key-value-${position}`}
        value={valueField}
        width="medium" />
    </div>
  );
};

export const renderFieldProperty = (nameField, valueField, onNameChange, onValueChange, readOnly, position) => {
  return (
    <div className="my-2">
      <div className="d-inline-block">
        {renderNameField(nameField, onNameChange, readOnly, position)}
      </div>
      <span className="d-inline-block mx-3">:</span>
      <div className="d-inline-block">
        {renderValueField(valueField, onValueChange, position)}
      </div>
    </div>
  );
};

const LocalizationLookup = ({ sdk }) => {
  const [jsonObject, setJsonObject] = useState({});
  const [nameField, setNameField] = useState('');
  const [valueField, setValueField] = useState('');
  const [editName, setEditName] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editKey, setEditKey] = useState('');
  const [uniqueErrorInFactory, setUniqueErrorInFactory] = useState(false);
  const [nameRequiredErrorInFactory, setNameRequiredErrorInFactory] = useState(false);
  const [uniqueError, setUniqueError] = useState(false);
  const [nameRequiredError, setNameRequiredError] = useState(false);

  useEffect(() => {
    if(sdk.field.getValue()) {
      setJsonObject(sdk.field.getValue());
    }
  }, [sdk.field]);

  const onNameFieldChange = event => {
    setNameField(event.currentTarget.value);
  };

  const onValueFieldChange = event => {
    setValueField(event.currentTarget.value);
  };

  const addProperty = () => {
    const keyValue = _.camelCase(nameField);
    const blankName = !nameField;
    const duplicateName = hasDuplicate(jsonObject, keyValue, '');

    setNameRequiredErrorInFactory(blankName);
    setUniqueErrorInFactory(hasDuplicate(jsonObject, keyValue));

    if (!blankName && !duplicateName) {
      const newJson = updateJson(jsonObject, keyValue, valueField);

      sdk.field.setValue(newJson);
      setJsonObject(newJson);
      setNameField('');
      setValueField('');
    }
  };

  const renderErrors = position => {
    return !nameRequiredError 
      ? renderError(uniqueError, uniqueErrorMessage, position) 
      : renderError(nameRequiredError, nameRequiredErrorMessage, position);
  };

  const renderFactoryErrors = () => {
    return !nameRequiredErrorInFactory 
      ? renderError(uniqueErrorInFactory, uniqueErrorMessage, 'factory') 
      : renderError(nameRequiredErrorInFactory, nameRequiredErrorMessage, 'factory');
  };

  const renderFieldFactory = () => {
    return (
      <div>
        <div className="d-inline-block">
          {renderFieldProperty(nameField, valueField, onNameFieldChange, onValueFieldChange, false, 'factory')}
        </div>
        <div className="d-inline-block ml-3">
          {renderButton('+', 'positive', () => addProperty(), 'factory')}
        </div>
        {renderFactoryErrors()}
      </div>
    );
  };

  const renderFieldItem = (nameIn, valueIn, position) => {
    const name = nameIn;
    let value = valueIn;
    let oldName = name;
    const disable = !(editKey === name);
  
    const onDelete = () => {
      const newObject = _.omit(jsonObject, [name]);
  
      sdk.field.setValue(newObject);
      setJsonObject(newObject);
      oldName = '';
    };

    const onCancel = () => {
      const newValue = updateJson(jsonObject, oldName, editValue);
  
      sdk.field.setValue(newValue);
      setJsonObject(newValue);
      setEditKey('');
      setUniqueError(false);
      setNameRequiredError(false);
    };

    const onEditClick = () => {
      setEditName(name);
      setEditValue(value);
      setEditKey(name);
    };

    const clearEdit = () => {
      setEditKey('');
      setEditName('');
      setEditValue('');
    };
  
    const onEditSave = () => {
      const keyValue = _.camelCase(editName);

      if (keyValue !== oldName) {
        const blankName = !editName;
        const duplicateName = hasDuplicate(jsonObject, keyValue, oldName);

        setNameRequiredError(!editName);
        setUniqueError(hasDuplicate(jsonObject, keyValue, oldName));
        
        if (!blankName && !duplicateName) {
          const newObject = _.omit(jsonObject, [oldName]);
          const newValue = updateJson(newObject, keyValue, editValue);
          
          sdk.field.setValue(newValue);
          oldName = name;
          setJsonObject(newValue);
          clearEdit();
        }
      } else {
        const newValue = updateJson(jsonObject, oldName, editValue);
  
        sdk.field.setValue(newValue);
        setJsonObject(newValue);
        clearEdit();
      }    
    };
  
    const onValueChange = event => {
      if (!editKey) {
        const newValue = updateJson(jsonObject, name, event.currentTarget.value);
  
        sdk.field.setValue(newValue);
        setJsonObject(newValue);
      }
      else {
        const newValue = updateJson(jsonObject, oldName, event.currentTarget.value);
  
        sdk.field.setValue(newValue);
        setJsonObject(newValue);
      }
      setEditValue(event.currentTarget.value);
      value = event.currentTarget.value;
    };

    const onEditNameChange = event => {
      setEditName(event.currentTarget.value);
    };
  
    const onEditValueChange = event => {
      setEditValue(event.currentTarget.value);
    };
    
    return disable ? (
      <div>
        <div className="d-inline-block">
          {renderFieldProperty(name, value, () => {}, onValueChange, disable, position)}
        </div>
        <div className="d-inline-block ml-3">
          {renderButton('Edit', 'primary', onEditClick, position)}
        </div>
        <div className="d-inline-block ml-1">
          {renderButton('-', 'negative', onDelete, position)}
        </div>
      </div>
    ) : (
      <div>
        <div className="d-inline-block">
          {renderFieldProperty(editName, editValue, onEditNameChange, onEditValueChange, disable, position)}
        </div>
        <div className="d-inline-block ml-3">
          {renderButton('Save', 'primary', onEditSave, position)}
        </div>
        <div className="d-inline-block ml-1">
          {renderButton('Cancel', 'muted', onCancel, position)}
        </div>
        {renderErrors(position)}
      </div>
    );
  };

  const renderFieldList = () => {

    const renderedList = _.keys(jsonObject).map((key, id) => {
      const divKey = id;
      const fieldValue = key ? jsonObject[key] : '';
  
      return (
        <div 
          id="row" 
          key={divKey}
          data-test-id="field-item">
          {renderFieldItem(key, fieldValue, id)}
        </div>
      );
    });
  
    return (
      <>
        {renderedList}
      </>
    );
  };

  return (
    <>
      <div>
        {renderFieldFactory()}
      </div>
      <div className="mt-4">
        {renderFieldList()}
      </div>
    </>
  );
  
};

LocalizationLookup.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired
};

export default LocalizationLookup;

