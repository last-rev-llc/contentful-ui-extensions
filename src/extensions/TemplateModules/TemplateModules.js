import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { CardDragHandle, DropdownList, DropdownListItem, IconButton } from '@contentful/forma-36-react-components';

import EntryCard, { getId } from './CardEntry';
import ModalEntitySelector from './ModalEntitySelector';
import ModalTemplateCreator from './ModalTemplateCreator';
import ModalTemplateSelector from './ModalTemplateSelector';
import CardNothing from './CardNothing';
import CardLoader from './CardLoader';

import { AddContentStyle, ContentButton } from './styles';

function getModal(sdk) {
  const { modal } = sdk.parameters.invocation || {};
  return modal;
}

function TemplateModules({ sdk }) {
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);

  /**
   * Loading and saving our entry to & from contentful
   */
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

  /**
   * Add or remove entries from the current template
   */
  const removeEntry = (entryId) => handleSetEntries(entries.filter((item) => entryId !== getId(item)));
  const addEntry = ({ item } = {}) => item && handleSetEntries(entries.concat(item));

  /**
   * When the user selects a template from the templateSelectorModal
   * we'll update the current entries to match that of the template
   */
  const selectTemplate = async ({ entries: templateEntries } = {}) => {
    if (!entries) {
      handleSetEntries([]);
      return;
    }

    setLoading(true);
    Promise.all(
      templateEntries.map(
        ({ id, entry }) =>
          // If we have an entry the user selected "new" for this entry type
          // otherwise we'll fetch from the current entry from the server
          entry || sdk.space.getEntry(id)
      )
    )
      .then(handleSetEntries)
      .then(() => setLoading(false));
  };

  /**
   * Move an entry to a specific position in the listing
   */
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

  if (loading) {
    return <CardLoader />;
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
                  <DropdownListItem onClick={() => removeEntry(id)}>Remove</DropdownListItem>
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
          onClick={() => showModal('ModalEntitySelector', { selectedEntryIds: entries.map(getId) }).then(addEntry)}>
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
    space: PropTypes.shape({
      getEntry: PropTypes.func
    }),
    ids: PropTypes.shape({
      extension: PropTypes.string
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
