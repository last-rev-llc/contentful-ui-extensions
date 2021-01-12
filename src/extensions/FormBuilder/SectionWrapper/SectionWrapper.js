import React from 'react';
import PropTypes from 'prop-types';
import { Card, Heading } from '@contentful/forma-36-react-components';

const SectionWrapperPropTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([
    //
    PropTypes.func,
    PropTypes.node,
    PropTypes.string
  ]).isRequired
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
