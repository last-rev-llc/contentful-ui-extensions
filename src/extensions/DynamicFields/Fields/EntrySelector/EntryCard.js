import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EntryCard as ContentfulCard, DropdownList, DropdownListItem } from '@contentful/forma-36-react-components';

const StyledEntryCard = styled(ContentfulCard)`
  margin-bottom: 20px;
`;

function EntryCard({ item, onChange, canRemove }) {
  const { fields, sys } = item;

  return (
    <StyledEntryCard
      size="small"
      key={sys?.id}
      onClick={() => onChange(item)}
      contentType={sys.contentType?.sys?.id}
      description={fields.internalTitle?.['en-US']}
      status={sys.publishedCounter > 0 ? 'published' : 'draft'}
      dropdownListElements={
        canRemove && (
          <DropdownList>
            <DropdownListItem isTitle>Actions</DropdownListItem>
            <DropdownListItem onClick={() => onChange(null)}>Remove</DropdownListItem>
          </DropdownList>
        )
      }
    />
  );
}

EntryCard.propTypes = {
  canRemove: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    sys: PropTypes.object,
    fields: PropTypes.object
  }).isRequired
};

EntryCard.defaultProps = {
  canRemove: false
};

export default EntryCard;
