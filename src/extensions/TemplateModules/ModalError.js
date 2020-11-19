import React from 'react';
import { Heading } from '@contentful/forma-36-react-components';

import { ModalStyle } from './styles';

function ErrorModal() {
  return (
    <ModalStyle title="Error fetching entries">
      <Heading>Error fetching entries</Heading>
      <div>
        <p>Unfortunately there was an error fetching your space entries. Please try to reload the page</p>
      </div>
    </ModalStyle>
  );
}

export default ErrorModal;
