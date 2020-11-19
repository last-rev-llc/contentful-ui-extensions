import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EntryCard as ContentfulCard } from '@contentful/forma-36-react-components';

const CardStyle = styled(ContentfulCard)`
  margin-top: 20px;
  transition: all 0.2s ease;

  &:hover {
    border: 1px solid lightblue;
  }

  width: 100%;
`;

function EntryCard({ type }) {
  return <CardStyle contentType="Not found" title={`No ${type} found`} />;
}

EntryCard.propTypes = { type: PropTypes.string };
EntryCard.defaultProps = { type: 'item' };

export default EntryCard;
