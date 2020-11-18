import React, { useState } from 'react';
import styled from 'styled-components';
import {
  CardDragHandle,
  DropdownList,
  DropdownListItem,
  EntryCard,
  IconButton
} from '@contentful/forma-36-react-components';
import { darken } from 'polished';

const cardHeight = '100px';

const ModuleCardStyle = styled(EntryCard)`
  min-width: 200px;
  height: ${cardHeight};
  width: 100%;

  margin-bottom: 20px;
`;

const AddContentStyle = styled.div`
  border: 1px dashed rgb(211, 220, 224);

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: ${cardHeight};
`;

const colors = { default: '#2d64b3', hover: darken(0.2, '#2d64b3') };

const AddContentButton = styled.span`
  color: ${colors.default};
  font-weight: bold;

  &:hover {
    color: ${colors.hover};
  }

  // icon button
  svg {
    fill: ${colors.default};
    margin-right: 4px;

    &:hover {
      fill: ${colors.hover} !important; // override the default contentful color
    }
  }

  cursor: pointer;
  user-select: none;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const entriesById = {
  1: {
    id: 1,
    status: 'published',
    contentType: 'module',
    title: 'Test module',
    description: 'Test description'
  },
  2: {
    id: 2,
    status: 'draft',
    contentType: 'module',
    title: 'Second module',
    description: 'Second description'
  }
};

function TemplateModules() {
  const [entries, setEntries] = useState([1, 2]);

  const removeItem = (entryId) => setEntries(entries.filter((id) => entryId !== id));

  const moveToPosition = (entryId, position) => {
    const toUpdate = entries.filter((id) => entryId !== id);
    toUpdate.splice(position, 0, entryId);
    setEntries(toUpdate);
  };

  return (
    <>
      {entries
        .map((entryId) => entriesById[entryId])
        .map(({ id, ...entryContent }, index) => (
          <ModuleCardStyle
            key={id}
            cardDragHandleComponent={<CardDragHandle>Reorder card</CardDragHandle>}
            dropdownListElements={
              <>
                <DropdownList>
                  <DropdownListItem isTitle>Actions</DropdownListItem>
                  <DropdownListItem onClick={() => removeItem(id)}>Remove</DropdownListItem>
                </DropdownList>
                <DropdownList>
                  <DropdownListItem onClick={() => moveToPosition(id, index - 1)}>Move up</DropdownListItem>
                  <DropdownListItem onClick={() => moveToPosition(id, index + 1)}>Move down</DropdownListItem>
                  <DropdownListItem onClick={() => moveToPosition(id, 0)}>Move to top</DropdownListItem>
                  <DropdownListItem onClick={() => moveToPosition(id, entries.length - 1)}>
                    Move to bottom
                  </DropdownListItem>
                </DropdownList>
              </>
            }
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...entryContent}
          />
        ))}
      <AddContentStyle>
        <AddContentButton>
          <IconButton label="Add content" buttonType="primary" iconProps={{ icon: 'PlusCircle', size: 'small' }} />
          <span>Add content</span>
        </AddContentButton>
      </AddContentStyle>
    </>
  );
}

export default TemplateModules;
