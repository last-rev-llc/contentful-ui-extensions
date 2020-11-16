import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { prop } from 'lodash/fp';
import { Modal, Spinner } from '@contentful/forma-36-react-components';

import EntryCard from './EntryCard';
import { SDKContext } from '../../../../contexts';
import { useAsync, renderIf } from '../../../../utils';

function EntrySelectorModal({ isShown, setShown, onChange }) {
  const sdk = useContext(SDKContext);
  const { error, response, loading } = useAsync(() => sdk.space.getEntries({ content_type: 'pageGeneral' }));

  if (loading) {
    return (
      <Modal title="Loading" isShown={isShown} onClose={() => setShown(false)}>
        <Spinner className="" color="default" customSize={42} size="default" testId="cf-ui-spinner" />
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal title="Error fetching entries" isShown={isShown} onClose={() => setShown(false)}>
        <p>Unfortunately there was an error fetching your space entries. Please try to reload the page</p>
      </Modal>
    );
  }

  const { items: entries } = response;

  return (
    <Modal title="Insert existing entry" isShown={isShown} onClose={() => setShown(false)}>
      {({ title, onClose }) => (
        <>
          <Modal.Header title={title} onClose={onClose} />
          <Modal.Content>
            {entries.map((item) => (
              <EntryCard key={item.sys?.id} item={item} onChange={onChange} />
            ))}
          </Modal.Content>
        </>
      )}
    </Modal>
  );
}

EntrySelectorModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  setShown: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default renderIf(prop('isShown'))(EntrySelectorModal);
