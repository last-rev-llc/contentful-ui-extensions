import React, { useState } from 'react';
import styled from 'styled-components';
import { EntryCard, CardDragHandle, DropdownList, DropdownListItem } from '@contentful/forma-36-react-components';

const cardHeight = '100px';

const ModuleCardStyle = styled(EntryCard)`
  min-width: 200px;
  height: ${cardHeight};
  width: 100%;

  margin-bottom: 20px;
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

  return entries
    .map((entryId) => entriesById[entryId])
    .map(({ id, ...entryContent }) => (
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
              <DropdownListItem onClick={() => moveToPosition(id, 0)}>Move to top</DropdownListItem>
              <DropdownListItem onClick={() => moveToPosition(id, entries.length - 1)}>Move to bottom</DropdownListItem>
            </DropdownList>
          </>
        }
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...entryContent}
      />
    ));
}

export default TemplateModules;
