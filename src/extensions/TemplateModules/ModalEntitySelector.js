import React, { useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Heading, Spinner } from '@contentful/forma-36-react-components';

import { SDKContext } from '../../context';
import { useAsync } from '../../utils/hooks';
import EntryCard, { getId } from './EntryCard';

import { ModalStyle } from './styles';

function EntrySelectorModal() {
  const sdk = useContext(SDKContext);

  const { selectedEntryIds = [] } = sdk.parameters.invocation;
  const { error, response, loading } = useAsync(() =>
    sdk.space
      .getEntries({ content_type: 'blogPost' })

      // Filter out all items which the user has already selected in the entity list
      .then(({ items }) => items.filter((entry) => selectedEntryIds.includes(getId(entry)) === false))
  );

  if (loading) {
    return (
      <ModalStyle title="Loading" className="loader">
        <Heading>Loading your entries</Heading>
        <div>
          <Spinner className="" color="default" customSize={42} size="default" testId="cf-ui-spinner" />
        </div>
      </ModalStyle>
    );
  }

  if (error) {
    return (
      <ModalStyle title="Error fetching entries">
        <p>Unfortunately there was an error fetching your space entries. Please try to reload the page</p>
      </ModalStyle>
    );
  }

  const handleItemSelect = (item) => () => sdk.close({ item });

  return (
    <ModalStyle>
      <Heading>Insert existing entry</Heading>
      <div>
        {response.map((item) => (
          <EntryCard key={getId(item)} item={item} onClick={handleItemSelect(item)} />
        ))}
      </div>
    </ModalStyle>
  );
}

EntrySelectorModal.propTypes = {};

EntrySelectorModal.defaultProps = {};

export default EntrySelectorModal;
