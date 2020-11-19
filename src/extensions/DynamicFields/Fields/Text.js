import React from "react";
import styled from "styled-components";
import { TextField } from "@contentful/forma-36-react-components";

import PropTypes from "prop-types";
import ContentSection from "./ContentSection";
import { fontDefault } from "../../../utils/styles";

const ValidationPromptStyle = styled.p`
  margin-top: 8px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${fontDefault}
`;

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
      <ValidationPromptStyle>
        <span>{currentValue.length} characters</span>
        <span>Maximum {maxLen} characters</span>
      </ValidationPromptStyle>
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
