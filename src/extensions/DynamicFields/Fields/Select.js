import React from "react";
import PropTypes from "prop-types";

import {
  Select as ContentfulSelect,
  Option
} from "@contentful/forma-36-react-components";

import styles from "./Fields.module.scss";
import ContentSection from "./ContentSection";

function Select({ about, name, onChange, values, options = [] }) {
  return (
    <ContentSection about={about}>
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

Select.propTypes = {
  about: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  options: PropTypes.arrayOf(PropTypes.any).isRequired
};

Select.defaultProps = {
  about: ""
};

export default Select;
