import React from 'react';
import { Heading, Spinner } from '@contentful/forma-36-react-components';

import { ModalStyle } from './styles';

function ErrorModal() {
  return (
    <ModalStyle title="Loading" className="loader">
      <Heading>Loading your entries</Heading>
      <div>
        <Spinner className="" color="default" customSize={42} size="default" testId="cf-ui-spinner" />
      </div>
    </ModalStyle>
  );
}

export default ErrorModal;
