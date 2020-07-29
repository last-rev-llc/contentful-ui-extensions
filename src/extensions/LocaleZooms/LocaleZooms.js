import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TextInput } from '@contentful/forma-36-react-components';
import { getSelect, getButton } from '../../shared/helpers';

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
  const [availableLocales, setAvailableLocales] = useState(_.keys(sdk.locales.names));
  const [locale, setLocale] = useState('');
  const [zoomId, setZoomId] = useState('');
  const [editKey, setEditKey] = useState('');
  const [editLocale, setEditLocale] = useState('');
  const [editZoomId, setEditZoomId] = useState('');
  const [noLocale, setNoLocale] = useState(false);

  const adjustLocales = (locales) => {
    setAvailableLocales(locales);
    setLocale(locales[0]);
    setNoLocale(!locales[0]);
  };

  useEffect(() => {
    if(sdk.field.getValue()) {
      setJsonObject(sdk.field.getValue());
      const usedLocales = _.keys(sdk.field.getValue());
      const filteredLocales = _.keys(sdk.locales.names).filter(name => usedLocales.every(usedLocale => usedLocale !== name));
      adjustLocales(filteredLocales);
    }
  }, [sdk.field, sdk.locales.names]);

  const onSelectedLocaleChange = event => {
    setLocale(event.currentTarget.value);
  };

  const onZoomIdChange = event => {
    setZoomId(event.currentTarget.value);
  };

  const addProperty = () => {
    const localeValue = locale;
    const blankLocale = !locale;
    const duplicateLocale = hasDuplicate(jsonObject, localeValue, '');
    if (!blankLocale && !duplicateLocale) {
      const newJson = updateJson(jsonObject, localeValue, zoomId);

      sdk.field.setValue(newJson);
      setJsonObject(newJson);
      setZoomId('');
      const newLocales = [ ...availableLocales ];
      adjustLocales(newLocales.filter(l => l !== localeValue));
    }
  };
  
  const getZoomIdField = (zoomIdField, onValueChange, position) => {
    return <TextInput
      className=""
      id={`zoomId-${position}`}
      name={`zoomId-${position}`}
      placeholder="Zoom ID"
      onChange={event => onValueChange(event)}
      required={false}
      testId={`cf-ui-text-input-zoom-id-${position}`}
      value={zoomIdField}
      width="medium" />;
  };
  
  const getFieldProperty = (localeField, zoomIdField, onLocaleChange, onZoomChange, readOnly, selectOptions, position) => {
    return (
      <div className="my-2">
        <div className="d-inline-block">
          {getSelect(selectOptions, onLocaleChange, { id: 'locales', disabled: readOnly, optionObject: sdk.locales.names }, localeField)}
        </div>
        <span className="d-inline-block mx-3">:</span>
        <div className="d-inline-block">
          {getZoomIdField(zoomIdField, onZoomChange, position)}
        </div>
      </div>
    );
  };

  const getFieldFactory = () => {
    return (
      <div>
        <div className="d-inline-block">
          {getFieldProperty(locale, zoomId, onSelectedLocaleChange, onZoomIdChange, false, availableLocales, 'factory')}
        </div>
        <div className="d-inline-block ml-3">
          {getButton('+', 'positive', addProperty)}
        </div>
      </div>
    );
  };

  const getFieldItem = (localeIn, zoomIdIn, position) => {
    const currentLocale = localeIn;
    let currentZoomId = zoomIdIn;
    let oldLocale = currentLocale;
    const disable = !(editKey === currentLocale);
  
    const onDelete = () => {
      const newObject = _.omit(jsonObject, [currentLocale]);
      const newLocales = [ ...availableLocales ];
      
      newLocales.push(currentLocale);
      adjustLocales(newLocales);

      sdk.field.setValue(newObject);
      setJsonObject(newObject);
      oldLocale = '';
    };

    const onCancel = () => {
      const newValue = updateJson(jsonObject, oldLocale, editZoomId);
  
      sdk.field.setValue(newValue);
      setJsonObject(newValue);
      setEditKey('');
    };

    const onEditClick = () => {
      setEditLocale(currentLocale);
      setEditZoomId(currentZoomId);
      setEditKey(currentLocale);
    };

    const clearEdit = () => {
      setEditKey('');
      setEditLocale('');
      setEditZoomId('');
    };
  
    const onEditSave = () => {
      const keyValue = editLocale;

      if (keyValue !== oldLocale) {
        const blankName = !editLocale;
        const duplicateName = hasDuplicate(jsonObject, keyValue, oldLocale);

        if (!blankName && !duplicateName) {
          const newObject = _.omit(jsonObject, [oldLocale]);
          const newValue = updateJson(newObject, keyValue, editZoomId);
          
          sdk.field.setValue(newValue);
          oldLocale = currentLocale;
          
          const usedLocales = _.keys(newValue);
          const filteredLocales = _.keys(sdk.locales.names).filter(name => usedLocales.every(usedLocale => usedLocale !== name));
          adjustLocales(filteredLocales);

          setJsonObject(newValue);
          clearEdit();
        }
      } else {
        const newValue = updateJson(jsonObject, oldLocale, editZoomId);
  
        sdk.field.setValue(newValue);
        setJsonObject(newValue);
        clearEdit();
      }    
    };
  
    const onValueChange = event => {
      if (!editKey) {
        const newValue = updateJson(jsonObject, currentLocale, event.currentTarget.value);
  
        sdk.field.setValue(newValue);
        setJsonObject(newValue);
      }
      else {
        const newValue = updateJson(jsonObject, oldLocale, event.currentTarget.value);
  
        sdk.field.setValue(newValue);
        setJsonObject(newValue);
      }
      setEditZoomId(event.currentTarget.value);
      currentZoomId = event.currentTarget.value;
    };

    const onEditLocaleChange = event => {
      setEditLocale(event.currentTarget.value);
    };
  
    const onEditZoomIdChange = event => {
      setEditZoomId(event.currentTarget.value);
    };

    const currentLocales = [ ...availableLocales ];
    currentLocales.push(currentLocale);
    
    return disable ? (
      <div>
        <div className="d-inline-block">
          {getFieldProperty(currentLocale, currentZoomId, () => {}, onValueChange, disable, currentLocales, position)}
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
          {getFieldProperty(editLocale, editZoomId, onEditLocaleChange, onEditZoomIdChange, disable, currentLocales, position)}
        </div>
        <div className="d-inline-block ml-3">
          {getButton('Save', 'primary', onEditSave)}
        </div>
        <div className="d-inline-block ml-1">
          {getButton('Cancel', 'muted', onCancel)}
        </div>
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
        {noLocale ? getError(true, 'No more locales available') : getFieldFactory()}
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