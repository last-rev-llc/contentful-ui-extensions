import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { withLabel } from '../../shared/helpers/formControl';
import './FormStack.scss';

const API_URL = process.env.REACT_APP_FORMSTACK_FORMS_URI;

const labelText = 'Chose your Formstack Form';

const FormStack = ({ sdk }) => {
  const [fieldValue, setFieldValue] = useState(undefined);
  const [allForms, setAllForms] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setInitialized(true);
      const response = await axios(API_URL);
      const { forms } = response.data;
      const getFormName = (id) => {
        const form = (forms || []).filter((f) => f.id.toString() === id)[0];
        return form && form.name;
      };
      setAllForms(forms);
      const value = sdk.field.getValue();
      if (value && value.formId) {
        setFieldValue({ value: value.formId, label: getFormName(value.formId) });
      }
    };
    if (!initialized) {
      fetchData();
    }
  }, [sdk.field, initialized]);

  const onSelectChange = (field) => {
    if (!field || !field.value || field.value === '') {
      setFieldValue(undefined);
      sdk.field.setValue({ formId: undefined, formName: undefined });
    } else {
      setFieldValue(field);
      sdk.field.setValue({ formId: field.value, formName: field.label });
    }
  };

  const onMenuClose = () => {
    sdk.window.startAutoResizer();
  };

  const calculateHeight = () => {
    const defaultHeight = 95;
    const itemHeight = 35;
    const itemsLength = allForms && allForms.length > 1 ? allForms.length : 1;
    const multiplier = itemsLength > 9 ? 9 : itemsLength;
    return multiplier * itemHeight + defaultHeight;
  };

  const onMenuOpen = () => {
    sdk.window.stopAutoResizer();
    sdk.window.updateHeight(calculateHeight());
  };

  return (
    <div className="formstack-container">
      {withLabel('formstack-select', labelText, () => (
        <Select
          className="fieldset"
          isClearable
          isSearchable
          name="formstack-select"
          id="formstack-select"
          value={fieldValue}
          testId="formstack-select"
          onChange={(e) => onSelectChange(e)}
          onMenuOpen={onMenuOpen}
          onMenuClose={onMenuClose}
          options={allForms.map((form) => ({ value: form.id.toString(), label: form.name }))}
        />
      ))}
    </div>
  );
};

FormStack.propTypes = {
  sdk: PropTypes.shape({
    window: PropTypes.shape({
      startAutoResizer: PropTypes.func.isRequired,
      stopAutoResizer: PropTypes.func.isRequired,
      updateHeight: PropTypes.func.isRequired
    }),
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    })
  }).isRequired
};

export default FormStack;
