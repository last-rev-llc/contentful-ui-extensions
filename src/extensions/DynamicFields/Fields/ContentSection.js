import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

import { HelpText } from "@contentful/forma-36-react-components";

import styles from "./Fields.module.scss";

function ErrorText({ children }) {
  if (!children) return null;

  return (
    <span className={styles.errorText}>
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
    </span>
  );
}

ErrorText.propTypes = { children: PropTypes.node.isRequired };

function ContentSection({ children, error, title, about, required }) {
  return (
    <div className={cx(styles.contentSection, { [styles.hasError]: error })}>
      {title && <label>{title}</label>}
      {required && <label className={styles.required}>(required)</label>}
      {children}
      <ErrorText>{error}</ErrorText>
      <HelpText className={styles.helpText}>{about}</HelpText>
    </div>
  );
}

ContentSection.propTypes = {
  children: PropTypes.node,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  title: PropTypes.string,
  about: PropTypes.string,
  required: PropTypes.bool
};

ContentSection.defaultProps = {
  children: null,
  error: false,
  title: null,
  about: null,
  required: false
};

export default ContentSection;
