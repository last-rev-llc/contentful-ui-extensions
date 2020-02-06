import React from 'react';
import _ from 'lodash';
import { render, cleanup, fireEvent, wait, configure } from '@testing-library/react';
import SingleAssetWithButton from './SingleAssetWithButton';
import mockContentfulSdk from '../../../__mocks__/mockContentfulSdk';
import mockContentfulAsset from '../../../__mocks__/mockContentfulAsset';

let sdk;

configure({
  testIdAttribute: 'data-test-id',
});

beforeEach(() => {
  sdk = mockContentfulSdk.init();
});

afterEach(() => {
  cleanup();
});

// TODO: Find out why we have to add wait() after rendering this component. If you remove wait() it throws an error
// This is the fix from the author https://github.com/testing-library/react-testing-library/issues/535#issuecomment-576816390
describe('<SingleAssetWithButton />', () => {
  test('should render the AssetCard if asset is found', async () => {
    const { queryByTestId } = render(<SingleAssetWithButton sdk={sdk}
      assetId="1234asdf" />);
    await wait();
    expect(queryByTestId('SingleAssetWithButton-AssetCard'))
      .toBeTruthy();
    expect(queryByTestId('SingleAssetWithButton-Button'))
      .toBeFalsy();
  });

  test('should render the button if no asset is found', async () => {
    const { queryByTestId } = render(<SingleAssetWithButton sdk={sdk} />);
    await wait();
    expect(queryByTestId('SingleAssetWithButton-AssetCard'))
      .toBeFalsy();
    expect(queryByTestId('SingleAssetWithButton-Button'))
      .toBeTruthy();
    expect(queryByTestId('SingleAssetWithButton-ErrorNote')).toBeFalsy();
  });

  test.todo('should show error message if JSON is not valid');

  test('should render the error note if Contentful returns an error', async () => {
    const { queryByTestId } = render(<SingleAssetWithButton assetId="1234asdf"
      sdk={{
        ...sdk,
        space:{
          ...sdk.space,
          getAsset: jest.fn().mockReturnValue(mockContentfulAsset.error)
        }
      }} />);
    await wait();
    expect(queryByTestId('SingleAssetWithButton-ErrorNote')).toBeTruthy();
  });

  test('should call handleFieldChange if passed in', async () => {
    const handleFieldChange = jest.fn();
    const { getByTestId } = render(<SingleAssetWithButton
      sdk={sdk} 
      handleFieldChange={handleFieldChange} />);
    await wait();
    fireEvent.click(getByTestId('SingleAssetWithButton-Button'));
    await wait();
    expect(handleFieldChange).toHaveBeenCalledTimes(1);
  });

  test('should render asset menu when clicked on', async () => {
    const { getByTestId, queryByTestId } = render(<SingleAssetWithButton assetId="1234asdf"
      sdk={sdk} />);
    await wait();
    fireEvent.click(getByTestId('cf-ui-card-actions').getElementsByTagName('button')[0]);
    await wait();
    expect(queryByTestId('SingleAssetWithButton-RemoveImage')).toBeTruthy();
    expect(queryByTestId('SingleAssetWithButton-ChangeImage')).toBeTruthy();
  });

  test('should handleRemoveImage when remove action menu item clicked and passed in', async () => {
    const handleRemoveImage = jest.fn();
    const { getByTestId } = render(<SingleAssetWithButton assetId="1234asdf"
      sdk={sdk} 
      handleRemoveImage={handleRemoveImage} />);
    await wait();
    fireEvent.click(getByTestId('cf-ui-card-actions').getElementsByTagName('button')[0]);
    await wait();
    fireEvent.click(getByTestId('SingleAssetWithButton-RemoveImage').getElementsByTagName('button')[0]);
    expect(handleRemoveImage).toHaveBeenCalledTimes(1);
  });
  test('clicking on change image should call handleChangeImage if passed in', async () => {
    const handleChangeImage = jest.fn();
    const { getByTestId } = render(<SingleAssetWithButton assetId="1234asdf"
      sdk={sdk} 
      handleChangeImage={handleChangeImage} />);
    await wait();
    fireEvent.click(getByTestId('cf-ui-card-actions').getElementsByTagName('button')[0]);
    await wait();
    fireEvent.click(getByTestId('SingleAssetWithButton-ChangeImage').getElementsByTagName('button')[0]);
    expect(handleChangeImage).toHaveBeenCalledTimes(1);
  });

  test('should default to the space locale if no field locale is present', async () => {
    const { getByTestId } = render(<SingleAssetWithButton sdk={_.omit(sdk, 'field')} />);
    await wait();
    fireEvent.click(getByTestId('SingleAssetWithButton-Button'));
    await wait();
    expect(getByTestId('SingleAssetWithButton-AssetCard')).toBeTruthy();
  });
});