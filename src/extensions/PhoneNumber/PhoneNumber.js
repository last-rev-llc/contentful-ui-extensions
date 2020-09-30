import React, { useState, useEffect } from "react";
import { TextField } from "@contentful/forma-36-react-components";
import PropTypes from "prop-types";

export default function PhoneNumber({ sdk }) {
  const [fieldValue, setFieldValue] = useState({});

  useEffect(() => {
    if (sdk.field.getValue()) {
      setFieldValue(sdk.field.getValue());
    } else {
      setFieldValue({});
    };

  }, [sdk.field]);

  const handleFieldChange = (fieldName) => (e) => {
    fieldValue[fieldName] = e.currentTarget.value;
    sdk.field.setValue(fieldValue);
    setFieldValue(fieldValue);
  };

  return (
    <div>
      <TextField
        value={fieldValue.label || ""}
        id="label"
        name="label"
        labelText="Label"
        textInputProps={{
          onChange: handleFieldChange('label'),
        }} />
      <TextField
        value={fieldValue.phoneNumber || ""}
        id="phoneNumber"
        name="phoneNumber"
        labelText="Phone Number"
        required
        textInputProps={{
          onChange: handleFieldChange('phoneNumber'),
        }} />
      <TextField
        value={fieldValue.extension || ""}
        id="extension"
        name="extension"
        labelText="Extension"
        textInputProps={{
          onChange: handleFieldChange('extension'),
        }} />
    </div>
  );
}

PhoneNumber.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired,
    }),
  }).isRequired,
};
