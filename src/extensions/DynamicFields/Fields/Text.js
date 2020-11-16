import React from "react";
import { TextField } from "@contentful/forma-36-react-components";

import PropTypes from "prop-types";
import styles from "./Fields.module.scss";
import ContentSection from "./ContentSection";

function Text({ about, title, name, onChange, values, maxLen }) {
  const currentValue = values[name] || "";

  let errorText = false;
  if (currentValue.length > maxLen) {
    errorText = `Please shorten the text so it's no longer than ${maxLen} characters`;
  }

  return (
    <ContentSection error={errorText} about={about}>
      <TextField
        id={name}
        key={name}
        name={name}
        value={currentValue}
        labelText={title}
        textInputProps={{ onChange }}
      />
      <p className={styles.validationPrompt}>
        <span>{currentValue.length} characters</span>
        <span>Maximum {maxLen} characters</span>
      </p>
    </ContentSection>
  );
}

Text.propTypes = {
  about: PropTypes.string,
  title: PropTypes.string,
  maxLen: PropTypes.number,

  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired
};

Text.defaultProps = {
  about: null,
  title: null,
  maxLen: 256
};

export default Text;
