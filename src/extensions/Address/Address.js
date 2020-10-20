import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@contentful/forma-36-react-components';
import StateDropdown from '../../shared/components/StateDropdown';
import './Address.scss';

function Address({ sdk }) {
  const [fieldValue, setFieldValue] = useState({});

  useEffect(() => {
    if (sdk.field.getValue()) {
      setFieldValue(sdk.field.getValue());
    } else {
      setFieldValue({});
    };
  }, [sdk.field]);

  const handleFieldChange = (fieldName) => (e) => {
    const value = {
      ...fieldValue,
      [fieldName]: e.currentTarget.value
    };
    sdk.field.setValue(value);
    setFieldValue(value);
  };

  return (
    <div>
      <TextField
        value={fieldValue.displayText || ''}
        id="displayText"
        name="displayText"
        labelText="Display Text"
        textInputProps={{
          onChange: handleFieldChange('displayText'),
        }}
        className="Address__field"
      />
      <TextField
        value={fieldValue.displaySummary || ''}
        id="displaySummary"
        name="displaySummary"
        labelText="Display Summary"
        textInputProps={{
          onChange: handleFieldChange('displaySummary'),
        }}
        className="Address__field"
      />
      <TextField
        value={fieldValue.streetAddress || ''}
        id="streetAddress"
        name="streetAddress"
        labelText="Street Address 1"
        required
        textInputProps={{
          onChange: handleFieldChange('streetAddress'),
        }}
        className="Address__field"
      />
      <TextField
        value={fieldValue.streetAddress2 || ''}
        id="streetAddress2"
        name="streetAddress2"
        labelText="Street Address 2"
        textInputProps={{
          onChange: handleFieldChange('streetAddress2'),
        }}
        className="Address__field"
      />
      <TextField
        value={fieldValue.city || ''}
        id="city"
        name="city"
        labelText="City"
        required
        textInputProps={{
          onChange: handleFieldChange('city'),
        }}
        className="Address__field"
      />
      <StateDropdown
        labelText="State"
        name="state"
        value={fieldValue.state || ''}
        onChange={handleFieldChange('state')}
        required
        className="Address__field"
      />
      <TextField
        value={fieldValue.postalCode || ''}
        id="postalCode"
        name="postalCode"
        labelText="Postal Code"
        required
        textInputProps={{
          onChange: handleFieldChange('postalCode'),
        }}
        className="Address__field"
      />
      <TextField
        value={fieldValue.latitude || ''}
        id="latitude"
        name="latitude"
        labelText="Latitude"
        textInputProps={{
          onChange: handleFieldChange('latitude'),
        }}
        className="Address__field"
      />
      <TextField
        value={fieldValue.longitude || ''}
        id="longitude"
        name="longitude"
        labelText="Longitude"
        textInputProps={{
          onChange: handleFieldChange('longitude'),
        }}
        className="Address__field"
      />
      <TextField
        value={fieldValue.googlePlacesId || ''}
        id="googlePlacesId"
        name="googlePlacesId"
        labelText="Google Places Id"
        textInputProps={{
          onChange: handleFieldChange('googlePlacesId'),
        }}
        className="Address__field"
      />
    </div>
  );
}

Address.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

export default Address;
