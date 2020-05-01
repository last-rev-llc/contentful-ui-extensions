import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TextInput, Button } from '@contentful/forma-36-react-components';
// import FieldProperty from './FieldProperty';

const buttonStyle = {
  marginTop: '-3px'
};

const updateJson = (json, name, value) => {
  return {
    ...json,
    [name]: value
  };
};

const renderButton = (label, buttonType, onClick) => {
  return <Button
    style={buttonStyle}
    buttonType={buttonType}
    isFullWidth={false}
    loading={false}
    onClick={onClick}
    testId="cf-ui-button"
    type="button">
    {label}
  </Button>;
};

const renderNameField = (nameField, onNameChange, readOnly) => {

  return (
    <div>
      <TextInput
        className=""
        disabled={readOnly}
        id="keyName"
        name="keyName"
        onChange={event => onNameChange(event)}
        required
        testId="cf-ui-text-input-key-name"
        value={nameField}
        width="medium" />
    </div>
  );
};

const renderValueField = (valueField, onValueChange) => {

  return (
    <div>
      <TextInput
        className=""
        id="keyValue"
        name="keyValue"
        onChange={event => onValueChange(event)}
        required={false}
        testId="cf-ui-text-input-key-value"
        value={valueField}
        width="medium" />
    </div>
  );
};

const renderFieldProperty = (nameField, valueField, onNameChange, onValueChange, readOnly) => {
  
  return (
    <div className="my-2">
      <div className="d-inline-block">
        {renderNameField(nameField, onNameChange, readOnly)}
      </div>
      <span className="d-inline-block mx-3">:</span>
      <div className="d-inline-block">
        {renderValueField(valueField, onValueChange)}
      </div>
    </div>
  );
};

const LocalizationLookup = ({ sdk }) => {
  const [jsonObject, setJsonObject] = useState({});
  const [nameField, setNameField] = useState('');
  const [valueField, setValueField] = useState('');
  const [editKey, setEditKey] = useState('');

  useEffect(() => {
    if(sdk.field.getValue()) {
      setJsonObject(sdk.field.getValue());
    }
  }, [sdk.field]);

  const onCancel = () => {
    setEditKey('');
  };

  const onNameFieldChange = event => {
    setNameField(event.currentTarget.value);
  };

  const onValueFieldChange = event => {
    setValueField(event.currentTarget.value);
  };

  const addProperty = () => {
    const newJson = updateJson(jsonObject, _.camelCase(nameField), valueField);

    sdk.field.setValue(newJson);
    setJsonObject(newJson);
    setNameField('');
    setValueField('');
  };

  const renderFieldFactory = () => {

    return (
      <div>
        <div className="d-inline-block">
          {/* <FieldProperty 
            nameField={nameField}
            valueField={valueField}
            onNameChange={onNameFieldChange} 
            onValueChange={onValueFieldChange}
            readOnly={false} /> */}
          {renderFieldProperty(nameField, valueField, onNameFieldChange, onValueFieldChange, false)}
        </div>
        <div className="d-inline-block ml-3">
          {renderButton('+', 'positive', () => addProperty(nameField, valueField))}
        </div>
      </div>
    );
  };

  const renderFieldItem = (nameIn, valueIn) => {
    let name = nameIn;
    let value = valueIn;
    let oldName = name;
    const disable = !(editKey === name);
  
    const onDelete = () => {
      const newObject = _.omit(jsonObject, [name]);
  
      sdk.field.setValue(newObject);
      setJsonObject(newObject);
      oldName = '';
    };
  
    const onEditSave = () => {
      const newObject = _.omit(jsonObject, [oldName]);
      const newValue = updateJson(newObject, _.camelCase(name), value);
      
      sdk.field.setValue(newValue);
      oldName = name;
      setJsonObject(newValue);
      setEditKey('');
    };
  
    const onNameChange = event => {
      name = event.currentTarget.value;
    };
  
    const onValueChange = event => {
      if (!editKey) {
        const newValue = updateJson(jsonObject, name, event.currentTarget.value);
  
        sdk.field.setValue(newValue);
        setJsonObject(newValue);
      }
      value = event.currentTarget.value;
    };
    
    return disable ? (
      <div>
        <div className="d-inline-block">
          {/* <FieldProperty 
            nameField={name}
            valueField={value}
            onNameChange={onNameChange} 
            onValueChange={onValueChange}
            readOnly={disable} /> */}
          {renderFieldProperty(name, value, onNameChange, onValueChange, disable)}
        </div>
        <div className="d-inline-block ml-3">
          {renderButton('Edit', 'primary', () => setEditKey(name))}
        </div>
        <div className="d-inline-block ml-1">
          {renderButton('-', 'negative', onDelete)}
        </div>
      </div>
    ) : (
      <div>
        <div className="d-inline-block">
          {/* <FieldProperty 
            nameField={name}
            valueField={value}
            onNameChange={onNameChange} 
            onValueChange={onValueChange}
            readOnly={disable} /> */}
          {renderFieldProperty(name, value, onNameChange, onValueChange, disable)}
        </div>
        <div className="d-inline-block ml-3">
          {renderButton('Save', 'primary', onEditSave)}
        </div>
        <div className="d-inline-block ml-1">
          {renderButton('Cancel', 'muted', onCancel)}
        </div>
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
          key={divKey}>
          {renderFieldItem(key, fieldValue)}
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

