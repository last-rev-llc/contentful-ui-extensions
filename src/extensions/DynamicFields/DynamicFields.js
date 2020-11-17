import React, { useState, useEffect } from 'react';
import { curry } from 'lodash';
import PropTypes from 'prop-types';

import TextField from './Fields/Text';
import SelectField from './Fields/Select';
import SlideIn from './Fields/SlideIn';
import EntrySelector from './Fields/EntrySelector';

function DynamicFields({ sdk }) {
  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {
    if (sdk.field.getValue()) {
      setFieldValues(sdk.field.getValue());
    } else {
      setFieldValues({});
    }
  }, [sdk.field]);

  const setValues = (newValues) => {
    sdk.field.setValue(newValues);

    // Copy values to ensure we render again
    setFieldValues({ ...newValues });
  };

  const handleFieldChange = curry((fieldName, value) =>
    setValues({
      ...fieldValues,
      [fieldName]: value
    })
  );

  const handleClickChange = (fieldName) => (e) => handleFieldChange(fieldName)(e.currentTarget.value);

  return (
    <div>
      <TextField
        required
        name="internalTitle"
        title="Internal title"
        about="To help reference this page within Contentful."
        values={fieldValues}
        onChange={handleClickChange('internalTitle')}
      />
      <TextField
        name="linkText"
        about="The text to be displayed."
        title="Link text"
        values={fieldValues}
        onChange={handleClickChange('linkText')}
      />
      <SelectField
        required
        name="action"
        values={fieldValues}
        title="Action"
        about="What will this CTA do?"
        setValues={setValues}
        options={[
          { value: 'window_same', label: 'Open in same window' },
          { value: 'window_new', label: 'Open in a new window' },
          { value: 'window_modal', label: 'Open in a modal' },
          { value: 'download', label: 'Download content' }
        ]}
      />
      <SelectField
        required
        title="Destination type"
        about="What content does the link point to?"
        name="destination"
        values={fieldValues}
        setValues={setValues}
        options={[
          { value: 'textManual', label: 'Manual text entry' },
          { value: 'contentReference', label: 'Content reference' },
          { value: 'assetReference', label: 'Asset reference' }
        ]}
      />
      {fieldValues.destination === 'contentReference' && (
        <EntrySelector
          required
          name="contentReference"
          title="Content Reference"
          about="If the CTA links to a page on impossiblefoods.com, select it here."
          values={fieldValues}
          onChange={handleFieldChange('contentReference')}
        />
      )}
      {fieldValues.destination === 'assetReference' && (
        <EntrySelector
          required
          name="assetReference"
          title="Asset Reference"
          about="If the CTA links to an image or video, please select it here."
          values={fieldValues}
          onChange={handleFieldChange('assetReference')}
        />
      )}
      {fieldValues.destination === 'textManual' && (
        <TextField
          required
          title="Manual url input"
          about="If the CTA links to page outside of the impossiblfoods.com domain, please specify the entire URL here."
          name="manualUrl"
          values={fieldValues}
          onChange={handleClickChange('manualUrl')}
        />
      )}
      <SelectField
        required
        title="Target"
        sabout="How should the browser open the link destination? _blank = opens the link in a new window _self = opens the link content in the same frame as the link _parent = opens the link content in the parent frame of the link _top = opens the link in the full body of the window"
        name="target"
        values={fieldValues}
        setValues={setValues}
        options={[{ value: '_blank' }, { value: '_parent' }, { value: '_self' }, { value: '_top' }]}
      />
    </div>
  );
}

DynamicFields.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    })
  }).isRequired
};

export default DynamicFields;
