import React, { useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Heading, Spinner } from '@contentful/forma-36-react-components';

import { SDKContext } from '../../context';
import { useAsync } from '../../utils/hooks';
import EntryCard, { getId } from './CardEntry';

import { ModalStyle } from './styles';
import ModalError from './ModalError';
import ModalLoading from './ModalLoading';

function EntrySelectorModal() {
  const sdk = useContext(SDKContext);

  const { selectedEntryIds = [] } = sdk.parameters.invocation;
  const { error, response, loading } = useAsync(() =>
    sdk.space
      .getEntries({ content_type: 'blogPost' })

      // Filter out all items which the user has already selected in the entity list
      .then(({ items }) => items.filter((entry) => selectedEntryIds.includes(getId(entry)) === false))
  );

  if (error) return <ModalError />;
  if (loading) return <ModalLoading />;

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
