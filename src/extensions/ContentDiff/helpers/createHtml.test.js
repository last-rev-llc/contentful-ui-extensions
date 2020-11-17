/* eslint-disable react/no-danger */
import React from 'react';
import { render, configure } from '@testing-library/react';
import { arraySimpleObject, assetFieldOne } from '../mockSdk';
import { createAssetHtml } from './index';
import { createHtmlForArray, createHtmlForEntry } from './createHtml';
import { symbolSimpleObject } from './testHelpers';
import {
  arrayLabelTestId,
  arrayListItemTestId,
  arrayListTestId,
  arrayWrapTestId,
  entryLabelTestId,
  entryValueTestId,
  entryWrapTestId
} from '../constants';

configure({
  testIdAttribute: 'data-test-id'
});

describe('helper/createHtml.js', () => {
  describe('createAssetHtml(asset = { fields: { title: { en-US }, file: { en-US: { url } } } })', () => {
    const assetTitleTestId = 'cdd-asset-title';
    const assetImageTestId = 'cdd-asset-image';
    test('shows asset image and title', () => {
      const { getByTestId } = render(<div dangerouslySetInnerHTML={{ __html: createAssetHtml(assetFieldOne) }} />);
      expect(getByTestId(assetTitleTestId).textContent).toBe(assetFieldOne.fields.title['en-US']);
      expect(getByTestId(assetImageTestId).src).toBe(assetFieldOne.fields.file['en-US'].url);
    });

    describe("doesn't show asset image or title", () => {
      test('if there is no asset', () => {
        const { queryByTestId } = render(<div dangerouslySetInnerHTML={{ __html: createAssetHtml(null) }} />);
        expect(queryByTestId(assetTitleTestId)).toBeNull();
        expect(queryByTestId(assetImageTestId)).toBeNull();
      });

      test('if there is no asset.fields', () => {
        const { queryByTestId } = render(<div dangerouslySetInnerHTML={{ __html: createAssetHtml({}) }} />);
        expect(queryByTestId(assetTitleTestId)).toBeNull();
        expect(queryByTestId(assetImageTestId)).toBeNull();
      });
    });
  });

  describe('createHtmlForEntry(field = { id, type, value, arrayType, label, asset })', () => {
    test('returns html for entry label and values', () => {
      const { getByTestId } = render(
        <div dangerouslySetInnerHTML={{ __html: createHtmlForEntry(symbolSimpleObject) }} />
      );
      expect(getByTestId(entryWrapTestId).getAttribute('class')).toMatch(new RegExp(symbolSimpleObject.type));
      expect(getByTestId(entryLabelTestId).textContent).toBe(symbolSimpleObject.label);
      expect(getByTestId(entryValueTestId).textContent).toBe(symbolSimpleObject.value);
    });
  });

  describe('createHtmlForArray(arrayField = { id, type, value, arrayType, label, asset })', () => {
    test('returns html for array label and all of its values in a list', () => {
      const { getByTestId, getAllByTestId, queryByTestId } = render(
        <div dangerouslySetInnerHTML={{ __html: createHtmlForArray(arraySimpleObject) }} />
      );
      expect(getByTestId(arrayWrapTestId).getAttribute('class')).toMatch(new RegExp(arraySimpleObject.type));
      expect(getByTestId(arrayLabelTestId).textContent).toBe(arraySimpleObject.label);
      expect(queryByTestId(arrayListTestId)).toBeTruthy();
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arraySimpleObject.value.length);
      expect(
        getAllByTestId(arrayListItemTestId).every((item, i) => item.textContent === arraySimpleObject.value[i])
      ).toBeTruthy();
    });
  });
});
