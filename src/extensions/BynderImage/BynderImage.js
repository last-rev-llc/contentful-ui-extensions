import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { TextInput } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import './BynderImage.scss';

export function setIfEmpty(sdk, fieldId, value) {
  const field = sdk.entry.fields[fieldId];
  const currentValue = field.getValue();
  if (!currentValue || currentValue === '') {
    field.setValue(value);
  }
}

const BynderImage = ({ sdk }) => {
  const [value, setValue] = useState(sdk.field.getValue() || '');
  const { fields } = sdk.entry;

  const onBynderImageChange = useCallback(
    (newValue) => {
      if (!Array.isArray(newValue)) return;
      if (newValue.length === 0) {
        fields.bynderId.setValue('');
        fields.imageName.setValue('');
        fields.altText.setValue('');
      } else {
        const bynderData = get(newValue, '[0]', {});
        const description = get(bynderData, 'description', '');
        const title = get(bynderData, 'name', '');
        const web = get(bynderData, 'thumbnails.webimage');
        if (fields.bynderId) fields.bynderId.setValue(get(bynderData, 'id', ''));
        if (fields.imageName) fields.imageName.setValue(title);
        if (fields.altText) fields.altText.setValue(description);
        if (fields.webImage) fields.webImage.setValue(web);
        setIfEmpty(sdk, 'internalTitle', title);
        setIfEmpty(sdk, 'altTextOverride', description);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields.bynderImage, fields.altText, fields.bynderId, fields.webImage, sdk]
  );

  const onExternalChange = (newValue) => {
    setValue(newValue);
  };

  const onChange = (e) => {
    const { value: newValue } = e.currentTarget;
    setValue(newValue);
    if (newValue) {
      sdk.field.setValue(newValue);
    } else {
      sdk.field.removeValue();
    }
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
    const bynderField = get(sdk, 'entry.fields["bynderData"]', null);
    if (bynderField) {
      bynderField.onValueChanged(onBynderImageChange);
      const newValue = bynderField.getValue();
      onBynderImageChange(newValue);
    }
    sdk.field.onValueChanged(onExternalChange);
  }, [sdk, onBynderImageChange]);

  return (
    <>
      <TextInput
        width="large"
        type="text"
        id="bynderImageId"
        data-testid="bynderImageTestId"
        value={value}
        onChange={onChange}
      />
    </>
  );
};

BynderImage.propTypes = {
  // eslint-disable-next-line
  sdk: PropTypes.object.isRequired
};

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }

export default BynderImage;
