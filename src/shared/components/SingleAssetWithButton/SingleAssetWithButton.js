/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { AssetCard, Button, DropdownList, DropdownListItem, Note } from '@contentful/forma-36-react-components';
import { getWorkflowState } from '../../modules/getWorkflowState';

const SingleAssetWithButton = ({ sdk, assetId, handleFieldChange, handleRemoveImage, handleChangeImage }) => {
  const [asset, setAsset] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (assetId) {
      (async () => {
        const fullAsset = await sdk.space.getAsset(assetId);
        // console.log('fullASset', fullAsset);
        if (fullAsset.sys.type === 'Error' && fullAsset.message) {
          setErrorMessage(fullAsset.message);
        } else {
          setAsset(fullAsset);
        }
      })();
    }
  }, [assetId]);

  const handleAssetSelection = async () => {
    const contentfulAsset = await sdk.dialogs.selectSingleAsset({
      locale: sdk.field.locale
    });

    setAsset(contentfulAsset);

    if (_.isFunction(handleFieldChange)) {
      handleFieldChange(contentfulAsset);
    }
  };

  const renderDropdownOptions = () => {
    return (
      <DropdownList>
        <DropdownListItem isTitle>Actions</DropdownListItem>
        <DropdownListItem
          testId="SingleAssetWithButton-RemoveImage"
          onClick={() => {
            handleRemoveImage();
            setAsset({});
          }}>
          Remove Image
        </DropdownListItem>
        <DropdownListItem
          testId="SingleAssetWithButton-ChangeImage"
          onClick={() => (handleChangeImage ? handleChangeImage() : handleAssetSelection())}>
          Change Image
        </DropdownListItem>
      </DropdownList>
    );
  };

  const renderErrorMessage = () => {
    if (errorMessage) {
      return (
        <Note
          noteType="negative"
          testId="SingleAssetWithButton-ErrorNote"
          title="There was an error loading the image.">
          Please choose the image again. This usually happens when the data has been updated from an external source.
          Please review our documenation for more information and how to prevent this to happen in the future.
        </Note>
      );
    }
    return null;
  };

  if (!_.isEmpty(asset) && _.isEmpty(errorMessage)) {
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
          testId="SingleAssetWithButton-AssetCard"
        />
      </div>
    );
  }
  return (
    <div>
      {renderErrorMessage()}
      <Button buttonType="positive" onClick={() => handleAssetSelection()} testId="SingleAssetWithButton-Button">
        Select an Image
      </Button>
    </div>
  );
};

SingleAssetWithButton.propTypes = {
  sdk: PropTypes.object.isRequired,
  assetId: PropTypes.string,
  handleFieldChange: PropTypes.func,
  handleChangeImage: PropTypes.func,
  handleRemoveImage: PropTypes.func
};

SingleAssetWithButton.defaultProps = {
  assetId: undefined,
  handleFieldChange: undefined,
  handleChangeImage: undefined,
  handleRemoveImage: undefined
};

export default SingleAssetWithButton;
