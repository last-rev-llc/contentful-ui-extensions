import React from 'react';
import { render, configure } from '@testing-library/react';
import { assetFieldOne, arraySimpleObject } from '../mockSdk';
import { createAssetHtml, arrayListTestId, arrayListItemTestId, getArrayValue } from './helpers';

configure({
  testIdAttribute: 'data-test-id',
});

describe('helper methods', () => {
  describe('createAssetHtml(asset = { fields: { title: { en-US }, file: { en-US: { url } } } })', () => {
    const assetTitleTestId = "cdd-asset-title";
    const assetImageTestId = "cdd-asset-image";
    test('shows asset image and title', () => {
      const { getByTestId } = render(<div dangerouslySetInnerHTML={{__html: createAssetHtml(assetFieldOne)}} />);
      expect(getByTestId(assetTitleTestId).textContent).toBe(assetFieldOne.fields.title['en-US']);
      expect(getByTestId(assetImageTestId).src).toBe(assetFieldOne.fields.file['en-US'].url);
    });

    describe('doesn\'t show asset image or title', () => {
      test('if there is no asset', () => {
        const { queryByTestId } = render(<div dangerouslySetInnerHTML={{__html: createAssetHtml(null)}} />);
        expect(queryByTestId(assetTitleTestId)).toBeNull();
        expect(queryByTestId(assetImageTestId)).toBeNull();
      });

      test('if there is no asset.fields', () => {
        const { queryByTestId } = render(<div dangerouslySetInnerHTML={{__html: createAssetHtml({})}} />);
        expect(queryByTestId(assetTitleTestId)).toBeNull();
        expect(queryByTestId(assetImageTestId)).toBeNull();
      });
    });
  });

  describe('getArrayValue(arrayField = { id, type, value, arrayType, label, asset })', () => {
    test('returns html for array and all of its values in a list', () => {
      const { getAllByTestId, queryByTestId } = render(<div dangerouslySetInnerHTML={{__html: getArrayValue(arraySimpleObject)}} />);
      expect(queryByTestId(arrayListTestId)).toBeTruthy();
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arraySimpleObject.value.length);
      expect(getAllByTestId(arrayListItemTestId).every((item, i) => item.textContent === arraySimpleObject.value[i])).toBeTruthy();
    });
  });
});