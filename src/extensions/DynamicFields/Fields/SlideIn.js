import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import cx from "classnames";

import styles from "./SlideIn.module.scss";

function SlideIn({ children, timeout, className }) {
  const [start, setStart] = useState(false);

  useEffect(() => {
    setTimeout(() => setStart(true), timeout);
  }, [timeout]);

  if (!start) {
    return (
      <div className={cx(styles.slider, className)}>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div className={cx(styles.slider, styles.slideStart, className)}>
      <div>{children}</div>
    </div>
  );
}

SlideIn.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  timeout: PropTypes.number
};

SlideIn.defaultProps = {
  timeout: 100,
  className: ""
};

export default SlideIn;
