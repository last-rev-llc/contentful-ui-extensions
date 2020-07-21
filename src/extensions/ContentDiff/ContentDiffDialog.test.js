import React from 'react';
import { render, cleanup, configure, fireEvent } from '@testing-library/react';
import diff from 'node-htmldiff';
import ContentDiffDialog, {
  getTextDiff,
  createAssetHtml,
  getFields,
  getFieldInfo,
  getFieldTables,
  getArrayValue
} from './ContentDiffDialog';
import sdk, {
  assetFieldOne,
  contentTypeSymbolFieldOne,
  contentTypeSymbolFieldTwo,
  entryOne,
  snapshotOne,
  snapshotTwo
} from './mockSdk';

configure({
  testIdAttribute: 'data-test-id',
});

const testContentType = {
  sys: {
    id: 'Testid123'
  },
  fields: [contentTypeSymbolFieldOne, contentTypeSymbolFieldTwo]
};

const testEditorInterface = {
  controls: [{
    fieldId: 'textMultiLineSimpleObject',
    widgetId: 'multipleLine'
  }]
};

sdk.space.getEntry = jest.fn(async () => entryOne);
sdk.space.getEntrySnapshots = jest.fn(async () => ({ items: [snapshotOne, snapshotTwo] }));
sdk.space.getContentType = jest.fn(async () => testContentType);
sdk.space.getEditorInterface = jest.fn(async () => testEditorInterface);
sdk.space.getAsset = jest.fn(async () => assetFieldOne);

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const diffFieldsTestId = "cdd-diff-fields";
const oldTextTestId = "cdd-old-text";
const newTextTestId = "cdd-new-text";
const diffTextTestId = "cdd-diff-text";
const fieldLabelTestId = "cdd-field-label";
const arrayListTestId = "cdd-array-list";
const arrayListItemTestId = "cdd-array-list-item";

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

const richTextEmbeddedEntryInfo = {
  nodeType: 'embedded-entry-block',
  data: {
    target: {
      sys: {
        id: 'Test123456'
      }
    }
  }
};

const richTextEmbeddedAssetInfo = {
  nodeType: 'embedded-asset-block',
  data: {
    target: {
      sys: {
        id: 'Test6789076654'
      }
    }
  }
};

const richTextParagraphTextInfo = {
  value: 'Rich Text Paragraph Text Info',
  nodeType: 'text'
};

const richTextParagraphEmbeddedEntryInfo = {
  nodeType: 'embedded-entry-inline',
  data: {
    target: {
      sys: {
        id: 'Test678907'
      }
    }
  }
};

const richTextEmbeddedParagraphInfo = {
  content: [richTextParagraphTextInfo, richTextParagraphEmbeddedEntryInfo]
};

const richTextParagraphInfo = {
  content: [richTextParagraphTextInfo]
};

const richTextFieldContent = {
  content: [richTextEmbeddedEntryInfo, richTextEmbeddedAssetInfo, richTextParagraphInfo, richTextEmbeddedParagraphInfo]
};

const richTextSimpleObject = {
  id: 'richTextSimpleObject',
  type: 'RichText', 
  value: richTextFieldContent, 
  label: 'Rich Text Simple Object',
  getValue: jest.fn(() => richTextSimpleObject.value)
};

const symbolSimpleObject = {
  id: 'symbolSimpleObject',
  type: 'Symbol', 
  value: 'this is test text', 
  label: 'Symbol Simple Object',
  getValue: jest.fn(() => symbolSimpleObject.value)
};

const textMultiLineSimpleObject = {
  id: 'textMultiLineSimpleObject',
  type: 'Text',
  textType: 'multipleLine',
  value: `
    this is multiLine text text
    here is another line
  `, 
  label: 'Text Multi Line Simple Object',
  getValue: jest.fn(() => textMultiLineSimpleObject.value)
};

const arraySimpleObject = {
  id: 'arraySimpleObject',
  type: 'Array', 
  value: ['test', 'testing', 'tested'], 
  arrayType: 'Symbol',
  label: 'Array Simple Object',
  getValue: jest.fn(() => arraySimpleObject.value),
  items: {
    type: 'Symbol'
  }
};

const linkSimpleObject = {
  id: 'linkSimpleObject',
  type: 'Link', 
  value: 'linkSimpleObject', 
  label: 'Link Simple Object',
  asset: assetFieldOne,
  getValue: jest.fn(() => linkSimpleObject.value),
  '_fieldLocales': {
    'en-US': {
      _value: {
        sys: {
          id: 'TestAssetID123456'
        }
      }
    }
  }
};

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

  describe('getArrayValue(arrayField = { id, type, value, arrayType, label, asset })', () => {
    test('returns html for array and all of its values in a list', () => {
      const { getAllByTestId, queryByTestId } = render(<div dangerouslySetInnerHTML={{__html: getArrayValue(arraySimpleObject)}} />);
      expect(queryByTestId(arrayListTestId)).toBeTruthy();
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arraySimpleObject.value.length);
      expect(getAllByTestId(arrayListItemTestId).every((item, i) => item.textContent === arraySimpleObject.value[i])).toBeTruthy();
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