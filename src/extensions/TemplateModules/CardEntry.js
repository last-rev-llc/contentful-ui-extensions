import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash/fp';
import { CardStyle } from './styles';

export const getId = get('sys.id');
export const getType = get('sys.contentType.sys.id');
export const getTitle = get('fields.title.en-US');
export const isPublished = get('sys.publishedCounter');

function CardEntry({ item, onClick, ...props }) {
  return (
    <CardStyle
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      onClick={onClick}
      contentType={getType(item)}
      title={getTitle(item)}
      status={isPublished(item) ? 'published' : 'draft'}
    />
  );
}

CardEntry.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func
};

CardEntry.defaultProps = {
  onClick: undefined
};

export default CardEntry;
