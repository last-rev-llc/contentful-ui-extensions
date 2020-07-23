import React from 'react';
import { render, configure } from '@testing-library/react';
import { assetFieldOne } from '../mockSdk';
import { createAssetHtml } from './index';

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
});