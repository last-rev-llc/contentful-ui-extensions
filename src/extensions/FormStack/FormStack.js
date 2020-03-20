import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  SelectField,
  Option, } from '@contentful/forma-36-react-components';
import PropTypes from 'prop-types';

const FormStack = ({ sdk }) => {
  const [fieldValue, setFieldValue] = useState('0');
  const [allForms, setAllForms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios('/.netlify/functions/formstack');
      const {forms} = response.data;
      setAllForms(forms);
      setFieldValue(sdk.field.getValue());
    };
    fetchData();
  }, [sdk]);
  

  const onSelectChange = (field) => {
    sdk.field.setValue(field.value);
  };
  return (
    <SelectField className="fieldset"
      labelText="Chose your Formstack Form"
      name="contentType"
      id="contentType"
      value={fieldValue}
      testId="SeoConfig-select-contentType"
      onChange={(e) => onSelectChange(e.currentTarget)}>
      <Option value="0"
        key="0">--</Option>
      {allForms.map((form) => {
        return (
          <Option value={form.url}
            key={form.id}>{form.name}</Option>
        );
      })}
    </SelectField>
  );
};

FormStack.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired,
    })
  }).isRequired
};

export default FormStack;
