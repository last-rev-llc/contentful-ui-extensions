import React from 'react';
import { render, cleanup, configure } from '@testing-library/react';
import diff from 'node-htmldiff';
import {
  getTextDiff,
  getFields,
  getFieldInfo,
  getFieldTables
} from './ContentDiffDialog';
import { arrayListTestId, arrayListItemTestId } from './shared/helpers';

configure({
  testIdAttribute: 'data-test-id',
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const diffFieldsTestId = "cdd-diff-fields";
const oldTextTestId = "cdd-old-text";
const newTextTestId = "cdd-new-text";
const diffTextTestId = "cdd-diff-text";
const fieldLabelTestId = "cdd-field-label";

const richTextFieldInfo = {
  id: 'richTextFieldInfo',
  type: 'RichText',
  label: 'Rich Text Field',
  content: {
    currentValue: 'currentValue',
    oldValue: 'oldValue'
  },
  currentValue: null,
  oldValue: null,
  arrayType: null,
};

const linkFieldInfo = {
  id: 'linkFieldInfo',
  type: 'Link',
  label: 'Link Field',
  content: null,
  currentValue: 'current symbol value',
  oldValue: 'old symbol value',
  arrayType: null,
};

const symbolFieldInfo = {
  id: 'symbolFieldInfo',
  type: 'Symbol',
  label: 'Symbol Field',
  content: null,
  currentValue: 'current symbol value',
  oldValue: 'old symbol value',
  arrayType: null,
};

const arrayFieldInfo = {
  id: 'arrayFieldInfo',
  type: 'Array',
  label: 'Array Field',
  content: null,
  currentValue: ['current', 'array', 'value'],
  oldValue: ['old', 'array', 'value'],
  arrayType: 'Symbol',
};

const arrayFieldLength = arrayFieldInfo.currentValue.length >= arrayFieldInfo.oldValue.length 
  ? arrayFieldInfo.currentValue.length 
  : arrayFieldInfo.oldValue.length;

const testFields = [richTextFieldInfo, symbolFieldInfo, arrayFieldInfo, linkFieldInfo];

describe('content-diff-dialog helper methods', () => {
  describe('getTextDiff(textInfo = {id, oldText, newText})', () => {
    const textInfo = {
      id: 'textInfo',
      keyId: 0,
      oldText: 'old',
      newText: 'new'
    };
    test('shows a div with the value of oldText', () => {
      const { getByTestId } = render(getTextDiff(textInfo));
      const oldText = getByTestId(oldTextTestId);
      expect(oldText.textContent).toBe(textInfo.oldText);
    });

    test('shows a div with the value of newText', () => {
      const { getByTestId } = render(getTextDiff(textInfo));
      const newText = getByTestId(newTextTestId);
      expect(newText.textContent).toBe(textInfo.newText);
    });

    test('shows a div with the value of diff(oldText, newText)', () => {
      const { getByTestId } = render(getTextDiff(textInfo));
      const diffTextDiv = getByTestId(diffTextTestId);
      const diffSpan = render(<span data-test-id="test"
        dangerouslySetInnerHTML={{__html: diff(textInfo.oldText, textInfo.newText)}} />);
      const diffHtmlText = diffSpan.getByTestId('test').textContent;

      expect(diffTextDiv.textContent).toBe(diffHtmlText);
    });
  });

  describe('getFields(field = { id, type, label, content: { currentValue, oldValue }, currentValue, oldValue, arrayType })', () => {
    test('shows rich text field info', () => {
      const { getByTestId } = render(getFields(richTextFieldInfo));
      expect(getByTestId(diffFieldsTestId).getAttribute('data-field-type')).toBe(richTextFieldInfo.type);
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });

    test('shows symbol field info', () => {
      const { getByTestId } = render(getFields(symbolFieldInfo));
      expect(getByTestId(diffFieldsTestId).getAttribute('data-field-type')).toBe(symbolFieldInfo.type);
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });

    test('shows array field info', () => {
      const { getByTestId, getAllByTestId } = render(getFields(arrayFieldInfo));
      expect(getByTestId(diffFieldsTestId).getAttribute('data-field-type')).toBe(arrayFieldInfo.type);
      expect(getAllByTestId(arrayListTestId).length).toBe(arrayFieldLength);
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arrayFieldLength * 3);
    });

    test('shows link field info', () => {
      const { getByTestId } = render(getFields(linkFieldInfo));
      expect(getByTestId(diffFieldsTestId).getAttribute('data-field-type')).toBe(linkFieldInfo.type);
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });
    
  });

  describe('getFieldInfo(id, field)', () => {
    test('shows rich text fields with label', () => {
      const { getByTestId } = render(getFieldInfo(0, richTextFieldInfo));
      expect(getByTestId(fieldLabelTestId).textContent).toBe(richTextFieldInfo.label);
      expect(getByTestId(diffFieldsTestId).textContent).not.toBeNull();
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });

    test('shows symbol fields with label', () => {
      const { getByTestId } = render(getFieldInfo(0, symbolFieldInfo));
      expect(getByTestId(fieldLabelTestId).textContent).toBe(symbolFieldInfo.label);
      expect(getByTestId(diffFieldsTestId).textContent).not.toBeNull();
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });

    test('shows array fields with label', () => {
      const { getByTestId, getAllByTestId } = render(getFieldInfo(0, arrayFieldInfo));
      expect(getByTestId(fieldLabelTestId).textContent).toBe(arrayFieldInfo.label);
      expect(getAllByTestId(arrayListTestId).length).toBe(arrayFieldLength);
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arrayFieldLength * 3);
    });

    test('shows link fields with label', () => {
      const { getByTestId } = render(getFieldInfo(0, linkFieldInfo));
      expect(getByTestId(fieldLabelTestId).textContent).toBe(linkFieldInfo.label);
      expect(getByTestId(diffFieldsTestId).textContent).not.toBeNull();
      expect(getByTestId(oldTextTestId).textContent).not.toBeNull();
      expect(getByTestId(diffTextTestId).textContent).not.toBeNull();
      expect(getByTestId(newTextTestId).textContent).not.toBeNull();
    });
    
  });

  describe('getFieldTables(fields = [{ id, type, label, content: { currentValue, oldValue }, currentValue, oldValue, arrayType }])', () => {
    test('shows all enabled fields and contents', () => {
      const { getAllByTestId } = render(getFieldTables(testFields));
      expect(getAllByTestId(fieldLabelTestId).length).toBe(testFields.length);
      expect(getAllByTestId(arrayListTestId).length).toBe(arrayFieldLength);
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arrayFieldLength * 3);
    });
  });

});

describe('<ContentDiffSidebar sdk={sdk} />', () => {
  describe('useEffect()', () => {

  });

  describe('onButtonClick()', () => {

  });

  describe('getDropdownAndButton()', () => {

  });

  describe('getLoadedInfo()', () => {

  });

  describe('getVersion()', () => {

  });

  describe('getOptions(options)', () => {

  });

  describe('render()', () => {

  });
});