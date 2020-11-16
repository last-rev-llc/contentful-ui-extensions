import React from 'react';

import { clone } from 'lodash';
import { Select as ContentfulSelect, Option } from '@contentful/forma-36-react-components';

import { FieldPropTypes, FieldDefaultProps } from './PropTypes';
import ContentSection from './ContentSection';

function Select({ about, title, name, onChange, setValues, values, options = [] }) {
  const handleChange = (event) => {
    const newValues = clone(values);

    options.forEach(({ value: valueKey }) => {
      delete newValues[valueKey];
    });

    newValues[name] = event.currentTarget.value;
    setValues(newValues);
  };

  return (
    <ContentSection title={title} about={about}>
      <ContentfulSelect id="optionSelect" name="optionSelect" onChange={handleChange} value={values[name]}>
        {options.map(({ value, label = value }) => (
          <Option key={value} value={value} onClick={onChange}>
            {label}
          </Option>
        ))}
      </ContentfulSelect>
    </ContentSection>
  );
}

Select.propTypes = FieldPropTypes;
Select.defaultProps = FieldDefaultProps;

export default Select;
