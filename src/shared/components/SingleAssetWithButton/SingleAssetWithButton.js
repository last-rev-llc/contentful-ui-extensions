/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {AssetCard, Button, DropdownList, DropdownListItem} from '@contentful/forma-36-react-components';
import { getWorkflowState } from '../../modules/getWorkflowState';

const SingleAssetWithButton = ({ sdk, assetId, handleFieldChange, handleRemoveImage, handleChangeImage }) => {
  const [asset, setAsset] = useState({});

  useEffect(() => {
    if(assetId) {
      (async () => {
        const fullAsset = await sdk.space.getAsset(assetId);
        setAsset(fullAsset);
      })();
    }
  }, [assetId]);

  const handleAssetSelection = async () => {
    const contentfulAsset = await sdk.dialogs.selectSingleAsset({
      locale: sdk.field.locale,
    });

    setAsset(contentfulAsset);

    if(_.isFunction(handleFieldChange)) {
      handleFieldChange(contentfulAsset);
    }
  };

  const renderDropdownOptions = () => {
    return (
      <DropdownList>
        <DropdownListItem isTitle>Actions</DropdownListItem>
        <DropdownListItem onClick={() => {
          handleRemoveImage();
          setAsset({});
        }}>
          Remove Image
        </DropdownListItem>
        <DropdownListItem onClick={() => handleChangeImage ? handleChangeImage() : handleAssetSelection()}>
          Change Image
        </DropdownListItem>
      </DropdownList>
    );
  };

  if(!_.isEmpty(asset)) {
    return (
      <div>
        <AssetCard
          className="social-image"
          status={getWorkflowState(asset)}
          type="image"
          isLoading={false}
          src={_.get(asset, `fields.file.${sdk.field.locale}.url`)}
          title={_.get(asset, `fields.title.${sdk.field.locale}`)}
          size="default"
          dropdownListElements={renderDropdownOptions()}
          testId="SingleAssetWithButton-AssetCard"/>
      </div>
    );
  }
  return (
    <div>
      <Button buttonType="positive"
        onClick={() => handleAssetSelection()}
        testId="SingleAssetWithButton-Button">Select an Image</Button>
    </div>
  );
};

SingleAssetWithButton.propTypes = {
  assetId: PropTypes.string,
  handleFieldChange: PropTypes.func,
  handleChangeImage: PropTypes.func,
  handleRemoveImage: PropTypes.func,
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      locale: PropTypes.string.isRequired,
    }),
    dialogs: PropTypes.shape({
      selectSingleAsset: PropTypes.func.isRequired,
    }).isRequired,
    space: PropTypes.shape({
      getAsset: PropTypes.func.isRequired,
    }).isRequired
  }).isRequired
};

SingleAssetWithButton.defaultProps = {
  assetId: undefined,
  handleFieldChange: undefined,
  handleChangeImage: undefined,
  handleRemoveImage: undefined,
};

export default SingleAssetWithButton;
