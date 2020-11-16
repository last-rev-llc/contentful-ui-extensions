import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { HelpText } from "@contentful/forma-36-react-components";

import { FieldPropTypes, FieldDefaultProps } from "./PropTypes";
import { colors } from "../../../utils/styles";

const ContentSectionStyle = styled.div`
  margin-bottom: 20px;
  padding-left: 14px;
  border-left: 3px solid rgb(211, 220, 224);

  display: flex;
  flex-direction: column;

  &:first-of-type {
    margin-top: 20px;
  }

  label {
    display: inline-block;

    color: #192532;
    font-weight: 600;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  ${({ hasError }) => hasError && `border-left: 3px solid ${colors.error};`}
`;

const RequiredLabelStyle = styled.label`
  font-weight: 400;
  margin-left: 0.25rem;
`;

const ErrorTextStyle = styled.span`
  color: ${colors.error};
  display: flex;
  flex-direction: row;
  align-items: center;

  svg {
    fill: ${colors.error};
    margin-right: 4px;
  }
`;

const HelpTextStyle = styled(HelpText)`
  margin-top: 8px;
  font-style: italic;
`;

function ErrorText({ children }) {
  if (!children) return null;

  return (
    <ErrorTextStyle>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
      {children}
    </ErrorTextStyle>
  );
}

ErrorText.propTypes = { children: PropTypes.node.isRequired };

function ContentSection({ children, error, title, about, required }) {
  return (
    <ContentSectionStyle hasError={error}>
      {title && <label>{title}</label>}
      {required && <RequiredLabelStyle>(required)</RequiredLabelStyle>}
      {children}
      <ErrorText>{error}</ErrorText>
      {about && (
        <HelpTextStyle>
          <span>{about}</span>
        </HelpTextStyle>
      )}
    </ContentSectionStyle>
  );
}

ContentSection.propTypes = FieldPropTypes;
ContentSection.defaultProps = FieldDefaultProps;

export default ContentSection;
