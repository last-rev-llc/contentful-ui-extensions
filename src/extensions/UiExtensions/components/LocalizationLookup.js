import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TextInput, Button } from '@contentful/forma-36-react-components';
// import FieldFactory from './FieldFactory';
// import FieldList from './FieldList';

const buttonStyle = {
  marginTop: '-3px'
};

const NameField = (nameField, onNameChange, readOnly) => {

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

const ValueField = (valueField, onValueChange) => {

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

const FieldProperty = (nameField, valueField, onNameChange, onValueChange, readOnly) => {
  
  return (
    <div className="my-2">
      <div className="d-inline-block">
        {NameField(nameField, onNameChange, readOnly)}
      </div>
      <span className="d-inline-block mx-3">:</span>
      <div className="d-inline-block">
        {ValueField(valueField, onValueChange)}
      </div>
    </div>
  );
};

const FieldFactory = (nameField, valueField, onNameChange, onValueChange, addProperty) => {

  return (
    <div>
      <div className="d-inline-block">
        {FieldProperty(nameField, valueField, onNameChange, onValueChange, false)}
      </div>
      <div className="d-inline-block ml-3">
        <Button
          style={buttonStyle}
          buttonType="positive"
          isFullWidth={false}
          loading={false}
          onClick={() => addProperty(nameField, valueField)}
          testId="cf-ui-button"
          type="button">
          +
        </Button>
      </div>
    </div>
  );
};

const FieldItem = (sdk, jsonObject, setJsonObject, nameField, valueField, editKey, setEditKey) => {
  // const [name, setName] = useState(nameField);
  // const [value, setValue] = useState(valueField);
  // const [isDisabled, setIsDisabled] = useState(true);
  // const [oldName, setOldName] = useState(nameField);
  let name = nameField;
  let value = valueField;
  let oldName = nameField;
  let disable = true;

  if (editKey === name) {
    disable = false;
  }

  const onDelete = () => {
    const newObject = _.omit(jsonObject, [name]);
    console.log('new object');
    console.log(newObject);

    sdk.field.setValue(newObject);
    console.log('sdk');
    console.log(sdk.field.getValue());

    setJsonObject(newObject);
    oldName = '';
    console.log('json object');
    console.log(jsonObject);
  };

  const onEditSave = () => {
    const newObject = _.omit(jsonObject, [oldName]);
    const newValue = {
      ...newObject,
      [_.camelCase(name)]: value
    };
    
    sdk.field.setValue(newValue);
    oldName = name;
    setJsonObject(newValue);
    console.log('in edit');
    console.log(jsonObject);
    setEditKey('');
  };

  const onNameChange = event => {
    name = event.currentTarget.value;
  };

  const onValueChange = event => {
    const newValue = {
      ...jsonObject,
      [name]: event.currentTarget.value
    };
    sdk.field.setValue(newValue);
    setJsonObject(newValue);
    value = event.currentTarget.value;
  };
  
  return disable ? (
    <div>
      <div className="d-inline-block">
        {FieldProperty(name, value, onNameChange, onValueChange, disable)}
      </div>
      <div className="d-inline-block ml-3">
        <Button
          style={buttonStyle}
          buttonType="primary"
          isFullWidth={false}
          loading={false}
          onClick={() => setEditKey(name)}
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
          onClick={onDelete}
          testId="cf-ui-button"
          type="button">
          -
        </Button>
      </div>
    </div>
  ) : (
    <div>
      <div className="d-inline-block">
        {FieldProperty(name, value, onNameChange, onValueChange, disable)}
      </div>
      <div className="d-inline-block ml-3">
        <Button
          style={buttonStyle}
          buttonType="primary"
          isFullWidth={false}
          loading={false}
          onClick={() => onEditSave()}
          testId="cf-ui-button"
          type="button">
          Save
        </Button>
      </div>
    </div>
  );
};

const FieldList = (sdk, jsonObject, setJsonObject, editKey, setEditKey) => {
  console.log(sdk);
  console.log(jsonObject);

  const renderedList = _.keys(jsonObject).map((key, id) => {
    let fieldValue = '';

    if (key) {
      fieldValue = jsonObject[key];
    }
    const divKey = id;

    return (
      <div 
        id="row" 
        key={divKey}>
        {FieldItem(sdk, jsonObject, setJsonObject, key, fieldValue || '', editKey, setEditKey)}
      </div>
    );
  });

  return (
    <>
      {renderedList}
    </>
  );
};

const addProperty = (json, name, value) => {
  return {
    ...json,
    [_.camelCase(name)]: value
  };
};

const LocalizationLookup = ({ sdk }) => {
  const [jsonObject, setJsonObject] = useState({});
  const [nameField, setNameField] = useState('');
  const [valueField, setValueField] = useState('');
  const [editKey, setEditKey] = useState('');

  // sdk.field.setValue({});
  // Sets the intial state value on component load to the Contentful value
  useEffect(() => {
    if(sdk.field.getValue()) {
      setJsonObject(sdk.field.getValue());
    }
  }, [sdk.field]);

  // const setDisable = disable => {
  //   setIsDisabled(disable);
  //   return isDisabled;
  // };

  const onNameChange = event => {
    setNameField(event.currentTarget.value);
  };

  const onValueChange = event => {
    setValueField(event.currentTarget.value);
  };

  const addProp = () => {
    const newJson = addProperty(jsonObject, nameField, valueField);
    sdk.field.setValue(newJson);
    setJsonObject(newJson);
    setNameField('');
    setValueField('');
  };

  return (
    <>
      <div>
        {FieldFactory(nameField, valueField, onNameChange, onValueChange, addProp)}
      </div>
      <div className="mt-4">
        {FieldList(sdk, jsonObject, setJsonObject, editKey, setEditKey)}
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

