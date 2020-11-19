import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { CardDragHandle, DropdownList, DropdownListItem, IconButton } from '@contentful/forma-36-react-components';
import { darken } from 'polished';

import EntryCard, { getId } from './CardEntry';
import ModalEntitySelector from './ModalEntitySelector';
import ModalTemplateCreator from './ModalTemplateCreator';
import ModalTemplateSelector from './ModalTemplateSelector';
import CardNothing from './CardNothing';

const cardHeight = '100px';

const AddContentStyle = styled.div`
  margin-top: 20px;
  border: 1px dashed rgb(211, 220, 224);

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: ${cardHeight};
`;

const colors = { default: '#2d64b3', hover: darken(0.2, '#2d64b3') };

const ContentButton = styled.span`
  margin-right: 20px;
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

function getModal(sdk) {
  const { modal } = sdk.parameters.invocation || {};
  return modal;
}

function TemplateModules({ sdk }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (sdk.field && sdk.field.getValue()) {
      setEntries(sdk.field.getValue());
    } else {
      setEntries([]);
    }
  }, [sdk.field]);

  const handleSetEntries = (newEntries) => {
    sdk.field.setValue(newEntries);
    setEntries(newEntries);
  };

  const removeItem = (entryId) => handleSetEntries(entries.filter((item) => entryId !== getId(item)));

  const addItem = ({ item } = {}) => item && handleSetEntries(entries.concat(item));

  const selectTemplate = async ({ entries: templateEntries } = {}) => {
    if (!entries) return;
    const resolvedEntries = await Promise.all(templateEntries.map(({ id }) => sdk.space.getEntry(id)));
    handleSetEntries(resolvedEntries);
  };

  const moveToPosition = (entryId, position) => {
    const found = entries.find((item) => entryId === getId(item));
    const toUpdate = entries.filter((item) => entryId !== getId(item));
    toUpdate.splice(position, 0, found);
    handleSetEntries(toUpdate);
  };

  const showModal = (modalName, parameters = {}) =>
    sdk.dialogs.openExtension({
      width: 500,
      id: sdk.ids.extension,
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      position: 'center',
      parameters: {
        modal: modalName,
        ...parameters
      }
    });

  switch (getModal(sdk)) {
    case 'ModalEntitySelector':
      return <ModalEntitySelector />;

    case 'ModalTemplateCreator':
      return <ModalTemplateCreator />;

    case 'ModalTemplateSelector':
      return <ModalTemplateSelector />;

    default:
      break;
  }

  return (
    <>
      {isEmpty(entries) && <CardNothing type="entries" />}
      {entries.map((item, index) => {
        const id = getId(item);
        return (
          <EntryCard
            key={id}
            item={item}
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
          />
        );
      })}
      <AddContentStyle>
        <ContentButton
          onClick={() => showModal('ModalEntitySelector', { selectedEntryIds: entries.map(getId) }).then(addItem)}>
          <IconButton label="Add content" buttonType="primary" iconProps={{ icon: 'PlusCircle', size: 'small' }} />
          <span>Add content</span>
        </ContentButton>
        <ContentButton onClick={() => showModal('ModalTemplateCreator', { entries })}>
          <IconButton label="Add content" buttonType="primary" iconProps={{ icon: 'Copy', size: 'small' }} />
          <span>Save as template</span>
        </ContentButton>
        <ContentButton onClick={() => showModal('ModalTemplateSelector').then(selectTemplate)}>
          <IconButton label="Add content" buttonType="primary" iconProps={{ icon: 'References', size: 'small' }} />
          <span>Load from template</span>
        </ContentButton>
      </AddContentStyle>
    </>
  );
}

TemplateModules.propTypes = {
  sdk: PropTypes.shape({
    window: PropTypes.shape({
      updateHeight: PropTypes.func.isRequired
    }),
    dialogs: PropTypes.shape({
      openExtension: PropTypes.func.isRequired
    }),
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    })
  }).isRequired
};

export default TemplateModules;
