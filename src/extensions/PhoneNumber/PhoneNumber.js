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
        textInputProps={{
          maxLength: 60,
          onKeyPress: (e) => handleLabelChange(e.currentTarget),
          onBlur: (e) => handleLabelChange(e.currentTarget),
          testId: "Seo-tabpanel-general-title",
        }} />
      <TextField
        value={fieldValue.phoneNumber || ""}
        id="phoneNumber"
        name="phoneNumber"
        labelText="phoneNumber"
        required
        textInputProps={{
          maxLength: 15,
          onKeyPress: (e) => handlePhoneNumberChange(e.currentTarget),
          onBlur: (e) => handlePhoneNumberChange(e.currentTarget),
          testId: "Seo-tabpanel-general-title",
        }} />
      <TextField
        value={fieldValue.extension || ""}
        id="extension"
        name="extension"
        labelText="extension"
        textInputProps={{
          maxLength: 10,
          onKeyPress: (e) => handleExtensionChange(e.currentTarget),
          onBlur: (e) => handleExtensionChange(e.currentTarget),
          testId: "Seo-tabpanel-general-title",
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
