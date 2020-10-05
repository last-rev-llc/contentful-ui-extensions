/* eslint-disable react/no-danger */
import React from 'react';
import { render, configure } from '@testing-library/react';
import { arraySimpleObject } from '../mockSdk';
import { getArrayType, getArrayValue, getId, getLabel, getTextValue, getType, getValue } from './getters';
import { arrayListItemTestId, arrayListTestId } from '../constants';
import { assetLinkSimpleObject, richTextSimpleObject, symbolSimpleObject } from './testHelpers';
import { resetLookups } from './lookups';

configure({
  testIdAttribute: 'data-test-id',
});

afterEach(() => {
  resetLookups();
});

describe('helpers/getters.js', () => {
  describe('getArrayValue(arrayField = { id, type, value, arrayType, label, asset })', () => {
    test('returns html for array and all of its values in a list', () => {
      const { getAllByTestId, queryByTestId } = render(
        <div dangerouslySetInnerHTML={{ __html: getArrayValue(arraySimpleObject) }} />
      );
      expect(queryByTestId(arrayListTestId)).toBeTruthy();
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arraySimpleObject.value.length);
      expect(
        getAllByTestId(arrayListItemTestId).every((item, i) => item.textContent === arraySimpleObject.value[i])
      ).toBeTruthy();
    });
  });

  describe('getValue(field = { id, type, value, arrayType, label, asset })', () => {
    test('returns value of symbol object', () => {
      const value = getValue(symbolSimpleObject);
      expect(value).toBe(symbolSimpleObject.value);
    });

    test('returns value of array object', () => {
      const value = getValue(arraySimpleObject);
      expect(value.length).toBe(arraySimpleObject.value.length);
      expect(value.every((v, i) => v === arraySimpleObject.value[i])).toBeTruthy();
    });

    test('returns asset of link object', () => {
      const value = getValue(assetLinkSimpleObject);
      expect(JSON.stringify(value)).toBe(JSON.stringify(assetLinkSimpleObject.asset));
    });
  });

  describe('getId(field = { id, type, value, arrayType, label, asset })', () => {
    test('returns id of symbol object', () => {
      const id = getId(symbolSimpleObject);
      expect(id).toBe(symbolSimpleObject.id);
    });

    test('returns id of array object', () => {
      const id = getId(arraySimpleObject);
      expect(id).toBe(arraySimpleObject.id);
    });

    test('returns id of link object', () => {
      const id = getId(assetLinkSimpleObject);
      expect(id).toBe(assetLinkSimpleObject.id);
    });

    test('returns id of rich text object', () => {
      const id = getId(richTextSimpleObject);
      expect(id).toBe(richTextSimpleObject.id);
    });
  });

  describe('getType(field = { id, type, value, arrayType, label, asset })', () => {
    test('returns type of symbol object', () => {
      const type = getType(symbolSimpleObject);
      expect(type).toBe(symbolSimpleObject.type);
    });

    test('returns type of array object', () => {
      const type = getType(arraySimpleObject);
      expect(type).toBe(arraySimpleObject.type);
    });

    test('returns type of link object', () => {
      const type = getType(assetLinkSimpleObject);
      expect(type).toBe(assetLinkSimpleObject.type);
    });

    test('returns type of rich text object', () => {
      const type = getType(richTextSimpleObject);
      expect(type).toBe(richTextSimpleObject.type);
    });
  });

  describe('getLabel(field = { id, type, value, arrayType, label, asset })', () => {
    test('returns label of symbol object', () => {
      const label = getLabel(symbolSimpleObject);
      expect(label).toBe(symbolSimpleObject.label);
    });

    test('returns label of array object', () => {
      const label = getLabel(arraySimpleObject);
      expect(label).toBe(arraySimpleObject.label);
    });

    test('returns label of link object', () => {
      const label = getLabel(assetLinkSimpleObject);
      expect(label).toBe(assetLinkSimpleObject.label);
    });

    test('returns label of rich text object', () => {
      const label = getLabel(richTextSimpleObject);
      expect(label).toBe(richTextSimpleObject.label);
    });
  });

  describe('getArrayType(field = { id, type, value, arrayType, label, asset })', () => {
    test('returns array type of symbol object', () => {
      const arrayType = getArrayType(symbolSimpleObject);
      expect(arrayType).toBe(symbolSimpleObject.arrayType);
    });

    test('returns array type of array object', () => {
      const arrayType = getArrayType(arraySimpleObject);
      expect(arrayType).toBe(arraySimpleObject.arrayType);
    });

    test('returns array type of link object', () => {
      const arrayType = getArrayType(assetLinkSimpleObject);
      expect(arrayType).toBe(assetLinkSimpleObject.arrayType);
    });

    test('returns array type of rich text object', () => {
      const arrayType = getArrayType(richTextSimpleObject);
      expect(arrayType).toBe(richTextSimpleObject.arrayType);
    });
  });

  describe('getTextValue(field)', () => {
    test('wraps text value in pre tags if code tags are present', () => {
      const testText = {
        value: '<code>this is wraped in code tags</code>',
      };
      const value = getTextValue(testText);
      expect(value.replace(testText.value, '')).toBe('<pre></pre>');
    });

    test('wraps text value in pre tags if text type is markdown', () => {
      const testText = {
        value: `
          markdown line 1
          markdown line 2
        `,
        textType: 'markdown',
      };
      const value = getTextValue(testText);
      expect(value.replace(testText.value, '')).toBe('<pre></pre>');
    });

    test('wraps text value in pre tags if text type is multipleLine', () => {
      const testText = {
        value: `
          multipleLine line 1
          multipleLine line 2
        `,
        textType: 'multipleLine',
      };
      const value = getTextValue(testText);
      expect(value.replace(testText.value, '')).toBe('<pre></pre>');
    });
  });
});
