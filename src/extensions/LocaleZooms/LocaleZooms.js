import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TextInput } from '@contentful/forma-36-react-components';
import { getSelect, getButton, updateJson, getError, hasDuplicate, getIconButton, getInfo } from '../../shared/helpers';

export const blankOptionValue = 'blank';
export const blankOptionName = 'Select Locale';
export const uniqueErrorMessage = 'This Locale has already been added. Please change the Locale to add field.';
export const localeRequiredErrorMessage = 'A Locale is required to add field.';
export const zoomIdRequiredErrorMessage = 'A Zoom ID is required to add field.';
export const zoomIdLengthErrorMessage = 'Zoom ID must be 10 or 11 characters in length to add field.';

export const zoomIdLengthMin = 10;
export const zoomIdLengthMax = 11;

export const withBlankOption = (options) => {
  const newValue = updateJson(options, blankOptionValue, blankOptionName);
  return newValue;
};

export const isToLength = (id) => id && ((id.length === zoomIdLengthMin) || (id.length === zoomIdLengthMax)); 

const LocaleZooms = ({ sdk }) => {
  const [jsonObject, setJsonObject] = useState({});
  const [locale, setLocale] = useState('');
  const [zoomId, setZoomId] = useState('');
  const [editKey, setEditKey] = useState('');
  const [editLocale, setEditLocale] = useState('');
  const [editZoomId, setEditZoomId] = useState('');
  const [noLocale, setNoLocale] = useState(false);
  const [localeRequiredError, setLocaleRequiredError] = useState(false);
  const [localeUniqueError, setLocaleUniqueError] = useState(false);
  const [zoomIdRequiredError, setZoomIdRequiredError] = useState(false);
  const [zoomIdLengthError, setZoomIdLengthError] = useState(false);
  const [localeRequiredErrorInFactory, setLocaleRequiredErrorInFactory] = useState(false);
  const [localeUniqueErrorInFactory, setLocaleUniqueErrorInFactory] = useState(false);
  const [zoomIdRequiredErrorInFactory, setZoomIdRequiredErrorInFactory] = useState(false);
  const [zoomIdLengthErrorInFactory, setZoomIdLengthErrorInFactory] = useState(false);

  const sortedOptions = (options) => {
    return options.sort((a, b) => {
      if (a === blankOptionValue) {
        return -1;
      }
      if (b === blankOptionValue) {
        return 1;
      }
      return sdk.locales.names[a].localeCompare(sdk.locales.names[b]);
    });
  };

  const prepareOptions = (options) => {
    const result = [ ...options ];

    if (result.every(option => option !== blankOptionValue)) {
      result.push(blankOptionValue);
    }

    return sortedOptions(result);
  };

  const [availableLocales, setAvailableLocales] = useState(prepareOptions(_.keys(sdk.locales.names)));
  
  const adjustLocales = (locales) => {
    setAvailableLocales(locales);
    setLocale(locales[0]);
    setNoLocale(locales.length === 1);
  };

  useEffect(() => {
    if(sdk.field.getValue()) {
      setJsonObject(sdk.field.getValue());
      const usedLocales = _.keys(sdk.field.getValue());
      const options = [ ..._.keys(sdk.locales.names) ];
      if (options.every(option => option !== blankOptionValue)) {
        options.push(blankOptionValue);
      }
  
      const optionsSorted = options.sort((a, b) => {
        if (a === blankOptionValue) {
          return -1;
        }
        if (b === blankOptionValue) {
          return 1;
        }
        return sdk.locales.names[a].localeCompare(sdk.locales.names[b]);
      });
      const filteredLocales = optionsSorted.filter(name => usedLocales.every(usedLocale => usedLocale !== name));
      adjustLocales(filteredLocales);
    }
  }, [sdk.field, sdk.locales.names]);

  const onSelectedLocaleChange = event => {
    setLocale(event.currentTarget.value);
  };

  const onZoomIdChange = event => {
    setZoomId(event.currentTarget.value);
  };

  const getListErrors = position => {
    let error = getError(zoomIdLengthError, zoomIdLengthErrorMessage, position);
    if (localeRequiredError) {
      error = getError(localeRequiredError, localeRequiredErrorMessage, position);
    }
    else if (localeUniqueError) {
      error = getError(localeUniqueError, uniqueErrorMessage, position);
    }
    else if (zoomIdRequiredError) {
      error = getError(zoomIdRequiredError, zoomIdRequiredErrorMessage, position);
    }
    return error;
  };

  const getFactoryErrors = () => {
    const position = 'factory';
    let error = getError(zoomIdLengthErrorInFactory, zoomIdLengthErrorMessage, position);
    if (localeRequiredErrorInFactory) {
      error = getError(localeRequiredErrorInFactory, localeRequiredErrorMessage, position);
    }
    else if (localeUniqueErrorInFactory) {
      error = getError(localeUniqueErrorInFactory, uniqueErrorMessage, position);
    }
    else if (zoomIdRequiredErrorInFactory) {
      error = getError(zoomIdRequiredErrorInFactory, zoomIdRequiredErrorMessage, position);
    }
    return error;
  };

  const addProperty = () => {
    const localeValue = locale;
    const blankLocale = locale === blankOptionValue;
    const blankZoomId = !zoomId;
    const wrongLength = !isToLength(zoomId);
    const duplicateLocale = hasDuplicate(jsonObject, localeValue, '');

    setLocaleRequiredErrorInFactory(blankLocale);
    setLocaleUniqueErrorInFactory(duplicateLocale);
    setZoomIdRequiredErrorInFactory(blankZoomId);
    setZoomIdLengthErrorInFactory(wrongLength);

    if (!blankLocale && !duplicateLocale && !blankZoomId && !wrongLength) {
      const newJson = updateJson(jsonObject, localeValue, zoomId);

      sdk.field.setValue(newJson);
      setJsonObject(newJson);
      setZoomId('');
      const newLocales = [ ...availableLocales ];
      adjustLocales(newLocales.filter(l => l !== localeValue));
    }
  };
  
  const getZoomIdField = (zoomIdField, onValueChange, position, readOnly) => {
    return <TextInput
      className=""
      id={`zoomId-${position}`}
      name={`zoomId-${position}`}
      placeholder="Zoom ID"
      onChange={event => onValueChange(event)}
      required={false}
      disabled={readOnly}
      testId={`cf-ui-text-input-zoom-id-${position}`}
      value={zoomIdField}
      width="medium" />;
  };
  
  const getFieldProperty = (localeField, zoomIdField, onLocaleChange, onZoomChange, readOnly, selectOptions, position) => {
    return (
      <div className="my-2">
        <div className="d-inline-block">
          {getSelect(sortedOptions(selectOptions), onLocaleChange, { id: `locales-${position}`, disabled: readOnly, optionObject: withBlankOption(sdk.locales.names) }, localeField, position)}
        </div>
        <span className="d-inline-block mx-3">:</span>
        <div className="d-inline-block">
          {getZoomIdField(zoomIdField, onZoomChange, position, readOnly)}
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
          {getIconButton('Click to add a new row', 'positive', 'PlusCircle', 'large', addProperty, 'factory')}
        </div>
        {getFactoryErrors()}
      </div>
    );
  };

  const getFieldItem = (localeIn, zoomIdIn, position) => {
    const currentLocale = localeIn;
    const currentZoomId = zoomIdIn;
    let oldLocale = currentLocale;
    const oldZoomId = currentZoomId;
    const disable = !(editKey === currentLocale);
  
    const onDelete = async () => {
      const deleteConfirmed = await sdk.dialogs.openConfirm({ 
        title: "Confirm Delete",
        message: "Are you sure you want to delete this item?",
        intent: "positive",
        confirmLabel: "Yes",
        cancelLabel: "No"
      });

      if (deleteConfirmed) { 
        const newObject = _.omit(jsonObject, [currentLocale]);
        const newLocales = [ ...availableLocales ];
        
        newLocales.push(currentLocale);
        adjustLocales(newLocales);

        sdk.field.setValue(newObject);
        setJsonObject(newObject);
        oldLocale = '';
      }
    };

    const onCancel = () => {
      const newValue = updateJson(jsonObject, oldLocale, oldZoomId);
  
      sdk.field.setValue(newValue);
      setJsonObject(newValue);
      setEditKey('');
      setLocaleUniqueError(false);
      setLocaleRequiredError(false);
      setZoomIdRequiredError(false);
      setZoomIdLengthError(false);
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
      const blankZoomId = !editZoomId;
      const wrongLength = !isToLength(editZoomId);

      setZoomIdRequiredError(blankZoomId);
      setZoomIdLengthError(wrongLength);
      if (keyValue !== oldLocale) {
        const blankLocale = editLocale === blankOptionValue;
        const duplicateLocale = hasDuplicate(jsonObject, keyValue, oldLocale);

        setLocaleRequiredError(blankLocale);
        setLocaleUniqueError(duplicateLocale);
        
        if (!blankLocale && !duplicateLocale && !blankZoomId && !wrongLength) {
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

        if (!blankZoomId && !wrongLength) {
          sdk.field.setValue(newValue);
          setJsonObject(newValue);
          clearEdit();
        }
      }    
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
          {getFieldProperty(currentLocale, currentZoomId, () => {}, () => {}, disable, currentLocales, position)}
        </div>
        <div className="d-inline-block ml-3">
          {getIconButton('Click to edit this row', 'muted', 'Edit', 'medium', onEditClick, position)}
        </div>
        <div className="d-inline-block ml-1">
          {getIconButton('Click to remove this row', 'negative', 'Delete', 'medium', onDelete, position)}
        </div>
      </div>
    ) : (
      <div>
        <div className="d-inline-block">
          {getFieldProperty(editLocale, editZoomId, onEditLocaleChange, onEditZoomIdChange, disable, currentLocales, position)}
        </div>
        <div className="d-inline-block ml-3">
          {getButton('Save', 'primary', onEditSave, position)}
        </div>
        <div className="d-inline-block ml-1">
          {getButton('Cancel', 'muted', onCancel, position)}
        </div>
        {getListErrors(position)}
      </div>
    );
  };

  const getFieldList = () => {
    const renderedList = sortedOptions(_.keys(jsonObject)).map((key, id) => {
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
        {noLocale ? getInfo('All locales have been chosen. Please delete or edit an item to make changes.') : getFieldFactory()}
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
    dialogs: PropTypes.shape({
      openConfirm: PropTypes.func.isRequired
    }),
  }).isRequired
};

export default LocaleZooms;