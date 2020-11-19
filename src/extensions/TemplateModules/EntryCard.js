import React from 'react';
import { get } from 'lodash/fp';
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

export const getId = get('sys.id');
export const getType = get('sys.contentType.sys.id');
export const getTitle = get('fields.title.en-US');
export const isPublished = get('sys.publishedCounter');

function EntryCard({ item, onClick }) {
  return (
    <CardStyle
      key={getId(item)}
      onClick={onClick}
      contentType={getType(item)}
      title={getTitle(item)}
      status={isPublished(item) ? 'published' : 'draft'}
    />
  );
}

export default EntryCard;
