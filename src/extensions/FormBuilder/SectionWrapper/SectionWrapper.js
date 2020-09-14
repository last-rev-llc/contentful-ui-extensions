import React from "react";
import PropTypes from "prop-types";
import { Card, Heading } from "@contentful/forma-36-react-components";

const SectionWrapperPropTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const SectionWrapper = ({ title, children }) => {
  return (
    <Card className="content">
      <Heading className="title">{title}</Heading>
      {children}
    </Card>
  );
};

SectionWrapper.propTypes = SectionWrapperPropTypes;

SectionWrapper.defaultProps = {};

export default SectionWrapper;
