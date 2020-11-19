import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, identity } from 'lodash';
import { CardDragHandle, DropdownList, DropdownListItem, IconButton } from '@contentful/forma-36-react-components';

import EntryCard, { getId, getType } from './CardEntry';
import ModalTemplateCreator from './ModalTemplateCreator';
import ModalTemplateSelector from './ModalTemplateSelector';
import CardNothing from './CardNothing';
import CardLoader from './CardLoader';

import { AddContentStyle, ContentButton } from './styles';

function getModal(sdk) {
  const { modal } = sdk.parameters.invocation || {};
  return modal;
}

function buildEntryStub(id) {
  return {
    sys: {
      id,
      type: 'Link',
      linkType: 'Entry'
    }
  };
}

function buildEntryStubs(entries) {
  return entries.map(getId).map(buildEntryStub);
}

function TemplateModules({ sdk }) {
  const [loading, setLoading] = useState(false);
  const [entryStubs, setEntryStubs] = useState([]);
  const [entries, setEntries] = useState([]);

  const handleSetEntries = (newEntries) => {
    sdk.field.setValue(buildEntryStubs(newEntries));
    setEntries(newEntries);
  };

  /**
   * Loading and saving our entry references to & from contentful
   * These should be an array of string Ids
   */
  useEffect(() => {
    if (sdk.field && sdk.field.getValue()) {
      setEntryStubs(sdk.field.getValue());
    } else {
      setEntryStubs([]);
    }
  }, [sdk.field]);

  /**
   * Loading the actual entries from contentful so that we
   * can display them in a list
   */
  useEffect(() => {
    setLoading(true);
    Promise.all(
      entries.map((entryId) =>
        // If we have an entry the user selected "new" for this entry type
        // otherwise we'll fetch from the current entry from the server
        sdk.space.getEntry(entryId)
      )
    )
      .then(setEntries)
      .then(() => setLoading(false));
  }, [entryStubs]);

  /**
   * Add or remove entries from the current template
   */
  const removeEntry = (entryId) => handleSetEntries(entries.filter((item) => entryId !== getId(item)));
  const addEntry = (items) => handleSetEntries(entries.concat(items).filter(identity));

  /**
   * When the user selects a template from the templateSelectorModal
   * we'll update the current entries to match that of the template
   */
  const selectTemplate = async ({ entries: templateEntries = [] } = {}) => {
    if (!entries) {
      handleSetEntries([]);
      return;
    }

    const resolvedEntries = await Promise.all(
      templateEntries.map(({ entry, id }) => {
        if (entry) {
          // Create a new entry in contentful with the data
          // we extracted from the template (entry)
          return sdk.space.createEntry(getType(entry), { fields: entry.fields });
        }

        // We have no entry, which means we're always asking
        // for the Entry by reference, Resolving to JSON Entry now
        return sdk.space.getEntry(id);
      })
    ).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      sdk.field.setValue([]);
    });

    handleSetEntries(resolvedEntries);
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
            onClick={() => sdk.navigator.openEntry(id, { slideIn: true })}
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
          // onClick={() => showModal('ModalEntitySelector', { selectedEntryIds: entries.map(getId) }).then(addEntry)}>
          onClick={() => sdk.dialogs.selectMultipleEntries().then(addEntry)}>
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
    navigator: PropTypes.shape({
      openEntry: PropTypes.func
    }),
    space: PropTypes.shape({
      getEntry: PropTypes.func,
      createEntry: PropTypes.func,
      selectMultipleEntries: PropTypes.func
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
