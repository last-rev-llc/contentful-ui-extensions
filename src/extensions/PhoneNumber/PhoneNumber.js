import React, { useState, useEffect } from "react";
import { TextField } from "@contentful/forma-36-react-components";
import PropTypes from "prop-types";

export default function PhoneNumber({ sdk }) {
  const [fieldValue, setFieldValue] = useState("");

  useEffect(() => {
    setFieldValue(sdk.field.getValue());
  }, [sdk.field]);

  const handleLabelChange = (e) => {
    fieldValue.label = e.value;
    sdk.field.setValue(fieldValue);
    setFieldValue(fieldValue);
  };

  const handlePhoneNumberChange = (e) => {
    fieldValue.phoneNumber = e.value;
    sdk.field.setValue(fieldValue);
    setFieldValue(fieldValue);
  };

  const handleExtensionChange = (e) => {
    fieldValue.extension = e.value;
    sdk.field.setValue(fieldValue);
    setFieldValue(fieldValue);
  };

  return (
    <div>
      <TextField
        value={fieldValue.label || ""}
        id="label"
        name="label"
        labelText="label"
        data-testid="phoneNumberLabel"
        textInputProps={{
          maxLength: 60,
          onChange: (e) => handleLabelChange(e.currentTarget),
        }} />
      <TextField
        value={fieldValue.phoneNumber || ""}
        id="phoneNumber"
        name="phoneNumber"
        labelText="phoneNumber"
        required
        data-testid="phoneNumber"
        textInputProps={{
          maxLength: 15,
          onChange: (e) => handlePhoneNumberChange(e.currentTarget),
        }} />
      <TextField
        value={fieldValue.extension || ""}
        id="extension"
        name="extension"
        labelText="extension"
        data-testid="phoneNumberExtension"
        textInputProps={{
          maxLength: 10,
          onChange: (e) => handleExtensionChange(e.currentTarget),
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
