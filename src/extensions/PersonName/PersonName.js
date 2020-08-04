import React, { useState, useEffect } from "react";
import { TextField } from "@contentful/forma-36-react-components";
import PropTypes from "prop-types";

export default function PersonName({ sdk }) {
  const [fieldValue, setFieldValue] = useState("");

  useEffect(() => {
    console.log(sdk);
    if(sdk.field.getValue()){ 
      setFieldValue(sdk.field.getValue());
    } else{ 
      setFieldValue({});
    };
    
  }, [sdk.field]);

  const handleSalutationChange = (e) => {
    fieldValue.salutation = e.value;
    sdk.field.setValue(fieldValue);
    setFieldValue(fieldValue);
  };

  const handleFirstNameChange = (e) => {
    fieldValue.firstName = e.value;
    sdk.field.setValue(fieldValue);
    setFieldValue(fieldValue);
  };

  const handleMiddleNameChange = (e) => {
    fieldValue.middleName = e.value;
    sdk.field.setValue(fieldValue);
    setFieldValue(fieldValue);
  };

  const handleLastNameChange = (e) => {
    fieldValue.lastName = e.value;
    sdk.field.setValue(fieldValue);
    setFieldValue(fieldValue);
  };

  const handleSuffixChange = (e) => {
    fieldValue.suffix = e.value;
    sdk.field.setValue(fieldValue);
    setFieldValue(fieldValue);
  };

  const handleNicknameChange = (e) => {
    fieldValue.nickname = e.value;
    sdk.field.setValue(fieldValue);
    setFieldValue(fieldValue);
  };

  return (
    <div>
      <TextField
        value={fieldValue.salutation || ""}
        id="salutation"
        name="salutation"
        labelText="salutation"
        data-testid="salutation"
        textInputProps={{
        //   maxLength: 60,
          onChange: (e) => handleSalutationChange(e.currentTarget),
        }} />
      <TextField
        value={fieldValue.firstName || ""}
        id="firstName"
        name="firstName"
        labelText="firstName"
        required
        data-testid="firstName"
        textInputProps={{
        //   maxLength: 15,
          onChange: (e) => handleFirstNameChange(e.currentTarget),
        }} />
      <TextField
        value={fieldValue.middleName || ""}
        id="middleName"
        name="middleName"
        labelText="middleName"
        data-testid="middleName"
        textInputProps={{
        //   maxLength: 10,
          onChange: (e) => handleMiddleNameChange(e.currentTarget),
        }} />
      <TextField
        value={fieldValue.lastName || ""}
        id="lastName"
        name="lastName"
        labelText="lastName"
        data-testid="lastName"
        textInputProps={{
        //   maxLength: 10,
          onChange: (e) => handleLastNameChange(e.currentTarget),
        }} />
      <TextField
        value={fieldValue.suffix || ""}
        id="suffix"
        name="suffix"
        labelText="suffix"
        data-testid="suffix"
        textInputProps={{
        //   maxLength: 10,
          onChange: (e) => handleSuffixChange(e.currentTarget),
        }} />
      <TextField
        value={fieldValue.nickname || ""}
        id="nickname"
        name="nickname"
        labelText="nickname"
        data-testid="nickname"
        textInputProps={{
        //   maxLength: 10,
          onChange: (e) => handleNicknameChange(e.currentTarget),
        }} />
    </div>
  );
}

PersonName.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired,
    }),
  }).isRequired,
};
