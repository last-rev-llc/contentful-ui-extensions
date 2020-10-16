import * as React from 'react';
import { CompactView } from '@bynder/compact-view';
import { Button } from '@contentful/forma-36-react-components';

const BYNDER_SDK_URL = 'https://d8ejoa1fys2rk.cloudfront.net/5.0.5/modules/compactview/bynder-compactview-2-latest.js';
const CTA = 'Select a file on Bynder';

function Bynder({ sdk, locations }) {
  function setSelectedFiles(assets, selectedFile) {
    console.log('aa', assets);
    console.log('selected', selectedFile);
  }

  async function openDialog() {
    await sdk.dialogs.openExtension({
      position: 'center',
      title: CTA,
      width: 1400,
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
    });
  }

  return sdk.location.is(locations.LOCATION_DIALOG)
    ? <CompactView assetTypes={['image', 'audio', 'document', 'video']} onSuccess={setSelectedFiles} mode="SingleSelectFile" />
    : (
      <Button
        icon="Asset"
        buttonType="muted"
        size="small"
        onClick={openDialog}
      >
        { CTA }
      </Button>
    );
}

export default Bynder;
