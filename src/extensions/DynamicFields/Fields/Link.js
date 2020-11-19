import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { lighten, saturate } from "polished";
import { flow as compose } from "lodash";

import { colors } from "../../../utils";

const hoverColor = compose(lighten(0.3), saturate(0.8))(colors.link);

const LinkStyle = styled.span`
  color: ${colors.link};
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    svg {
      fill: ${hoverColor};
    }
    color: ${hoverColor};
  }

  &:focus {
    outline: none;
  }

  svg {
    fill: blue;
    margin-right: 8px;
  }
`;

function Link({ onClick, children }) {
  return (
    <LinkStyle tabIndex="0" role="button" onClick={onClick}>
      {children}
    </LinkStyle>
  );
}

Link.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.node])),
    PropTypes.func
  ]).isRequired
};

Link.defaultProps = {
  onClick: () => {}
};

export default Link;
