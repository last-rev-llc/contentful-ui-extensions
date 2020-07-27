import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TextInput } from '@contentful/forma-36-react-components';
import { getSelect, getButton } from '../../shared/helpers';

const buttonStyle = {
  marginTop: '-3px'
};

export const localeRequiredErrorMessage = 'A locale must be selected.';
export const zoomIdRequiredErrorMessage = 'A Zoom ID is required.';
export const zoomIdLengthErrorMessage = 'The Zoom ID must be at least 10 or 11 digits.';

export const updateJson = (json, name, value) => {
  return {
    ...json,
    [name]: value
  };
};

export const getError = (error, message) => {
  return error ? (
    <div 
      className="alert alert-danger"
      data-test-id="error">
      {message}
    </div>
  ) : null;
};

export const hasDuplicate = (jsonObject, newName, oldName) => {
  return _.keys(jsonObject)
    .filter(key => key !== oldName)
    .some(key => newName.toUpperCase() === key.toUpperCase());
};

const LocaleZooms = ({ sdk }) => {
  const [jsonObject, setJsonObject] = useState({});
  const [locale, setLocale] = useState('');
  const [zoomId, setZoomId] = useState('');
  const [editKey, setEditKey] = useState('');
  const [editLocale, setEditLocale] = useState('');
  const [editZoomId, setEditZoomId] = useState('');

  useEffect(() => {
    if(sdk.field.getValue()) {
      setJsonObject(sdk.field.getValue());
    }
  }, [sdk.field]);

  const onSelectedLocaleChange = event => {
    console.log(event.currentTarget.value);
    setLocale(event.currentTarget.value);
  };

  const onZoomIdChange = event => {
    setZoomId(event.currentTarget.value);
  };

  const addProperty = () => {
    console.log('locale', locale);
    const keyValue = _.camelCase(locale);
    const blankName = !locale;
    const duplicateName = hasDuplicate(jsonObject, keyValue, '');

    // setNameRequiredErrorInFactory(blankName);
    // setUniqueErrorInFactory(hasDuplicate(jsonObject, keyValue));

    if (!blankName && !duplicateName) {
      const newJson = updateJson(jsonObject, keyValue, zoomId);

      sdk.field.setValue(newJson);
      setJsonObject(newJson);
      setLocale('');
      setZoomId('');
    }
  };
  
  const getZoomIdField = (zoomIdField, onValueChange) => {
    return <TextInput
      className=""
      id="zoomId"
      name="zoomId"
      placeholder="Zoom ID"
      onChange={event => onValueChange(event)}
      required={false}
      testId="cf-ui-text-input-key-value"
      value={zoomIdField}
      width="medium" />;
  };
  
  const getFieldProperty = (localeField, zoomIdField, onLocaleChange, onZoomChange, readOnly) => {
    return (
      <div className="my-2">
        <div className="d-inline-block">
          {getSelect(_.keys(sdk.locales.names), onLocaleChange, { id: 'locales', disabled: readOnly })}
        </div>
        <span className="d-inline-block mx-3">:</span>
        <div className="d-inline-block">
          {getZoomIdField(zoomIdField, onZoomChange)}
        </div>
      </div>
    );
  };

  const getFieldFactory = () => {
    return (
      <div>
        <div className="d-inline-block">
          {getFieldProperty(locale, zoomId, onSelectedLocaleChange, onZoomIdChange, false)}
        </div>
        <div className="d-inline-block ml-3">
          {getButton('+', 'positive', addProperty)}
        </div>
        {/* {renderFactoryErrors()} */}
      </div>
    );
  };

  const getFieldItem = (nameIn, valueIn) => {
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
      const newValue = updateJson(jsonObject, oldName, editZoomId);
  
      sdk.field.setValue(newValue);
      setJsonObject(newValue);
      setEditKey('');
    };

    const onEditClick = () => {
      setEditLocale(name);
      setEditZoomId(value);
      setEditKey(name);
    };

    const clearEdit = () => {
      setEditKey('');
      setEditLocale('');
      setEditZoomId('');
    };
  
    const onEditSave = () => {
      // const keyValue = _.camelCase(editName);

      // if (keyValue !== oldName) {
      //   const blankName = !editName;
      //   const duplicateName = hasDuplicate(jsonObject, keyValue, oldName);

      //   // setNameRequiredError(!editName);
      //   // setUniqueError(hasDuplicate(jsonObject, keyValue, oldName));
        
      //   if (!blankName && !duplicateName) {
      //     const newObject = _.omit(jsonObject, [oldName]);
      //     const newValue = updateJson(newObject, keyValue, editValue);
          
      //     sdk.field.setValue(newValue);
      //     oldName = name;
      //     setJsonObject(newValue);
      //     clearEdit();
      //   }
      // } else {
      //   const newValue = updateJson(jsonObject, oldName, editValue);
  
      //   sdk.field.setValue(newValue);
      //   setJsonObject(newValue);
      //   clearEdit();
      // }    
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
      setEditZoomId(event.currentTarget.value);
      value = event.currentTarget.value;
    };

    const onEditLocaleChange = event => {
      setEditLocale(event.currentTarget.value);
    };
  
    const onEditZoomIdChange = event => {
      setEditZoomId(event.currentTarget.value);
    };
    
    return disable ? (
      <div>
        <div className="d-inline-block">
          {getFieldProperty(name, value, () => {}, onValueChange, disable)}
        </div>
        <div className="d-inline-block ml-3">
          {getButton('Edit', 'primary', onEditClick)}
        </div>
        <div className="d-inline-block ml-1">
          {getButton('-', 'negative', onDelete)}
        </div>
      </div>
    ) : (
      <div>
        <div className="d-inline-block">
          {getFieldProperty(editLocale, editZoomId, onEditLocaleChange, onEditZoomIdChange, disable)}
        </div>
        <div className="d-inline-block ml-3">
          {getButton('Save', 'primary', onEditSave)}
        </div>
        <div className="d-inline-block ml-1">
          {getButton('Cancel', 'muted', onCancel)}
        </div>
        {/* {renderErrors()} */}
      </div>
    );
  };

  const getFieldList = () => {

    const renderedList = _.keys(jsonObject).map((key, id) => {
      const divKey = id;
      const fieldValue = key ? jsonObject[key] : '';
  
      return (
        <div 
          id="row" 
          key={divKey}
          data-test-id="field-item">
          {getFieldItem(key, fieldValue, id)}
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
        {getFieldFactory()}
      </div>
      <div className="mt-4">
        {getFieldList()}
      </div>
    </>
  );

};

LocaleZooms.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
    locales: PropTypes.shape({
      names: PropTypes.object
    }),
  }).isRequired
};

export default LocaleZooms;