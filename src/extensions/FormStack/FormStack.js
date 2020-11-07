import React, { useState, useEffect } from "react";
import axios from "axios";
import { SelectField, Option } from "@contentful/forma-36-react-components";
import PropTypes from "prop-types";

const API_URL = process.env.REACT_APP_FORMSTACK_FORMS_URI;

const FormStack = ({ sdk }) => {
  const [fieldValue, setFieldValue] = useState("0");
  const [allForms, setAllForms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios(API_URL);
      const { forms } = response.data;
      setAllForms(forms);
      const value = sdk.field.getValue();
      if (value && value.formId) setFieldValue(value.formId);
      else setFieldValue("");
    };
    if (!API_URL) return;
    fetchData();
  }, [sdk]);

  const onSelectChange = field => {
    if (!field || !field.value || field.value === "") {
      sdk.field.setValue({ formId: null });
    } else sdk.field.setValue({ formId: field.value });
  };
  return (
    <SelectField
      className="fieldset"
      labelText="Chose your Formstack Form"
      name="contentType"
      id="contentType"
      value={fieldValue}
      testId="SeoConfig-select-contentType"
      onChange={e => onSelectChange(e.currentTarget)}
    >
      <Option value="">--</Option>
      {allForms.map(form => {
        return (
          <Option value={form.id} key={form.id}>
            {form.name}
          </Option>
        );
      })}
    </SelectField>
  );
};

FormStack.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    })
  }).isRequired
};

export default FormStack;
