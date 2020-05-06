import React from 'react';
import { Button } from '@contentful/forma-36-react-components';

const openPreviewDialog = (sdk) => {
   
};
function PreviewButton({sdk}) {
  return (
    <Button onClick={() => sdk.dialogs.openExtension({
      id: '1iYrvC4JrZoyZMrHDPtHgn',
      width: 'fullWidth',
      position: 'top',
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      minHeight: '700px'
    })}>
      Preview
    </Button>
  );
}

export default PreviewButton;
