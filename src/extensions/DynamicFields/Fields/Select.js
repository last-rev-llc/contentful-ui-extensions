import React from "react";
import PropTypes from "prop-types";

import {
  Select as ContentfulSelect,
  Option
} from "@contentful/forma-36-react-components";

import { FieldPropTypes, FieldDefaultProps } from "./PropTypes";
import ContentSection from "./ContentSection";

function Select({ about, title, name, onChange, values, options = [] }) {
  return (
    <ContentSection title={title} about={about}>
      <ContentfulSelect
        id="optionSelect"
        name="optionSelect"
        onChange={onChange}
        value={values[name]}
      >
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
