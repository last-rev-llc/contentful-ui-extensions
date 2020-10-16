import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { Button } from '@contentful/forma-36-react-components';
import './Bynder.scss';

const BYNDER_SDK_URL = 'https://d8ejoa1fys2rk.cloudfront.net/5.0.5/modules/compactview/bynder-compactview-2-latest.js';
const CTA = 'Select a file on Bynder';

function Bynder({ sdk, locations }) {
  const [thumbnail, setThumbnail] = useState(null);

  function makeThumbnail(resource) {
    const url = resource.files.webImage && resource.files.webImage.url;
    const alt = [resource.id, ...(resource.tags || [])].join(', ');

    setThumbnail({ url, alt });
  }

  useEffect(() => {
    if (sdk.location.is(locations.LOCATION_DIALOG)) {
      return;
    }

    if (sdk.field.getValue()) {
      makeThumbnail(sdk.field.getValue().asset);
    } else {
      setThumbnail(null);
    }
  }, [sdk.field, sdk.location, locations.LOCATION_DIALOG]);

  function setSelectedFiles(assets, selectedFile) {
    sdk.close({ asset: assets[0], selectedFile: selectedFile.selectedFile });
  }

  function renderDialog() {
    const script = document.createElement('script');
    script.src = BYNDER_SDK_URL;
    script.async = true;

    script.onload = () => {
      window.BynderCompactView.open({
        assetTypes: ['image', 'audio', 'document', 'video'],
        mode: 'SingleSelectFile',
        onSuccess: setSelectedFiles
      });
    };

    document.body.appendChild(script);

    return <></>;
  }

  async function openDialog() {
    const result = await sdk.dialogs.openExtension({
      position: 'center',
      title: CTA,
      width: 1400,
      minHeight: 800,
      allowHeightOverflow: true,
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
    });

    if (result && result.asset) {
      sdk.field.setValue({
        asset: result.asset,
        selectedFile: result.selectedFile
      });

      makeThumbnail(result.asset);
    }
  }

  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    return renderDialog();
  }

  return (
    <div>
      {
        thumbnail && (
          <div className="Bynder__card">
            <img src={thumbnail.url} alt={thumbnail.alt} />
          </div>
        )
      }
      <Button
        icon="Asset"
        buttonType="muted"
        size="small"
        onClick={openDialog}
      >
        { CTA }
      </Button>
    </div>
  );
}

Bynder.propTypes = {
  locations: PropTypes.shape({
    LOCATION_DIALOG: PropTypes.string
  }).isRequired,
  sdk: PropTypes.shape({
    close: PropTypes.func,
    dialogs: PropTypes.shape({
      openExtension: PropTypes.func
    }),
    field: PropTypes.shape({
      getValue: PropTypes.func,
      setValue: PropTypes.func
    }),
    location: PropTypes.shape({
      is: PropTypes.func
    })
  }).isRequired
};

export default Bynder;
