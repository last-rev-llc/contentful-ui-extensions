import React, { useState, useEffect } from "react";
import { TextField } from "@contentful/forma-36-react-components";
import PropTypes from "prop-types";

export default function PersonName({ sdk }) {
  const [fieldValue, setFieldValue] = useState({});

  useEffect(() => {
    if (sdk.field.getValue()) {
      setFieldValue(sdk.field.getValue());
    } else {
      setFieldValue({});
    }
  }, [sdk.field]);

  const handleFieldChange = fieldName => e => {
    fieldValue[fieldName] = e.currentTarget.value;
    sdk.field.setValue(fieldValue);
    setFieldValue(fieldValue);
  };

  return (
    <div>
      <TextField
        value={fieldValue.salutation || ""}
        id="salutation"
        name="salutation"
        labelText="Salutation"
        textInputProps={{
          onChange: handleFieldChange("salutation")
        }}
      />
      <TextField
        value={fieldValue.firstName || ""}
        id="firstName"
        name="firstName"
        labelText="First Name"
        required
        textInputProps={{
          onChange: handleFieldChange("firstName")
        }}
      />
      <TextField
        value={fieldValue.middleName || ""}
        id="middleName"
        name="middleName"
        labelText="Middle Name"
        textInputProps={{
          onChange: handleFieldChange("middleName")
        }}
      />
      <TextField
        value={fieldValue.lastName || ""}
        id="lastName"
        name="lastName"
        labelText="Last Name"
        required
        textInputProps={{
          onChange: handleFieldChange("lastName")
        }}
      />
      <TextField
        value={fieldValue.suffix || ""}
        id="suffix"
        name="suffix"
        labelText="Suffix"
        textInputProps={{
          onChange: handleFieldChange("suffix")
        }}
      />
      <TextField
        value={fieldValue.nickname || ""}
        id="nickname"
        name="nickname"
        labelText="Nickname"
        textInputProps={{
          onChange: handleFieldChange("nickname")
        }}
      />
    </div>
  );
}

PersonName.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    })
  }).isRequired
};
