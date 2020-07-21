import React from 'react';
import _ from 'lodash';
import { render, cleanup, configure, waitForElement, fireEvent } from '@testing-library/react';
import ContentDiffSidebar, {
  resetLookups,
  createAssetHtml,
  getEntryByDate,
  createContentSimpleObjects,
  createSimpleObjects,
  getValue,
  createHtmlForEntry,
  getArrayValue,
  createHtmlForArray,
  getEmbeddedEntryValue,
  createHtmlForEmbeddedEntryLines,
  createRichTextLines,
  getId,
  getType,
  getLabel,
  getArrayType,
  getContent,
  createDiffFields,
  addRemovedOldFields,
  getTextValue
} from './ContentDiffSidebar';
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
  resetLookups();
});

const entryWrapTestId = "cdd-entry-wrap";
const entryLabelTestId = "cdd-entry-label";
const entryValueTestId = "cdd-entry-value";
const arrayListTestId = "cdd-array-list";
const arrayListItemTestId = "cdd-array-list-item";
const arrayWrapTestId = "cdd-array-wrap";
const arrayLabelTestId = "cdd-array-label";

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

const richTextSnapshotObject = {
  id: 'richTextSnapshotObject',
  type: 'RichText', 
  value: richTextFieldContent, 
  label: 'Rich Text Snapshot Object',
  'en-US': richTextFieldContent
};

const symbolSnapshotObject = {
  id: 'symbolSnapshotObject',
  type: 'Symbol', 
  value: 'this is test text', 
  label: 'Symbol Snapshot Object',
  'en-US': 'this is test text'
};

const textMultiLineSnapshotObject = {
  id: 'textMultiLineSnapshotObject',
  type: 'Text', 
  textType: 'multipleLine', 
  value: `
    this is multiLine text text
    here is another line
  `, 
  label: 'Text Multi Line Snapshot Object',
  'en-US': `
    this is multiLine text text
    here is another line
  `
};

const arraySnapshotObject = {
  id: 'arraySnapshotObject',
  type: 'Array', 
  value: ['test', 'testing', 'tested'], 
  arrayType: 'Symbol',
  label: 'Array Snapshot Object',
  'en-US': ['test', 'testing', 'tested'],
  items: {
    type: 'Symbol'
  }
};

const linkSnapshotObject = {
  id: 'linkSnapshotObject',
  type: 'Link', 
  value: {
    sys: {
      id: 'TestAssetID123456'
    }
  }, 
  label: 'Link Snapshot Object',
  asset: assetFieldOne,
  'en-US': {
    sys: {
      id: 'TestAssetID123456'
    }
  }
};

const richTextSnapshotControl = {
  field: {
    type: richTextSnapshotObject.type,
    name: richTextSnapshotObject.label
  },
  fieldId: richTextSnapshotObject.id
};

const symbolSnapshotControl = {
  field: {
    type: symbolSnapshotObject.type,
    name: symbolSnapshotObject.label
  },
  fieldId: symbolSnapshotObject.id
};

const arraySnapshotControl = {
  field: {
    type: arraySnapshotObject.type,
    name: arraySnapshotObject.label
  },
  fieldId: arraySnapshotObject.id
};

const linkSnapshotControl = {
  field: {
    type: linkSnapshotObject.type,
    name: linkSnapshotObject.label
  },
  fieldId: linkSnapshotObject.id
};

const textMultiLineSnapshotControl = {
  field: {
    type: textMultiLineSnapshotObject.type,
    name: textMultiLineSnapshotObject.label
  },
  fieldId: textMultiLineSnapshotObject.id,
  widgetId: textMultiLineSnapshotObject.textType
};

const richTextControl = {
  field: {
    type: richTextSimpleObject.type,
    name: richTextSimpleObject.label
  },
  fieldId: richTextSimpleObject.id
};

const symbolControl = {
  field: {
    type: symbolSimpleObject.type,
    name: symbolSimpleObject.label
  },
  fieldId: symbolSimpleObject.id
};

const arrayControl = {
  field: {
    type: arraySimpleObject.type,
    name: arraySimpleObject.label
  },
  fieldId: arraySimpleObject.id
};

const linkControl = {
  field: {
    type: linkSimpleObject.type,
    name: linkSimpleObject.label
  },
  fieldId: linkSimpleObject.id
};

const textMultiLineControl = {
  field: {
    type: textMultiLineSimpleObject.type,
    name: textMultiLineSimpleObject.label
  },
  fieldId: textMultiLineSimpleObject.id,
  widgetId: textMultiLineSimpleObject.textType
};
const testControls = [richTextControl, symbolControl, arrayControl, linkControl, textMultiLineControl];
const testSnapshotControls = [richTextSnapshotControl, symbolSnapshotControl, arraySnapshotControl, linkSnapshotControl, textMultiLineSnapshotControl];

const testEntry = {
  richTextSimpleObject,
  symbolSimpleObject,
  arraySimpleObject,
  linkSimpleObject,
  textMultiLineSimpleObject
};

const testSnapshot = {
  richTextSnapshotObject,
  symbolSnapshotObject,
  arraySnapshotObject,
  linkSnapshotObject,
  textMultiLineSnapshotObject
};

const paragraphLineOne = { nodeType: 'text', value: 'line 1', marks: [] };

const embeddedAssetLine = {
  nodeType: 'embedded-asset-block',
  data: {
    target: {
      sys: {
        id: 'testAssetId4567'
      }
    }
  }
};

const embeddedEntryLine = {
  nodeType: 'embedded-entry-block',
  data: {
    target: {
      sys: {
        id: 'testEntryId4567'
      }
    }
  }
};

const paragraphLine = {
  nodeType: 'paragraph',
  data: {
    target: {
      sys: {
        id: 'testParagraphId4567'
      }
    }
  },
  marks: [],
  content: [paragraphLineOne]
};

const embeddedEntryInline = {
  nodeType: 'embedded-entry-inline',
  data: {
    target: {
      sys: {
        id: 'testInlineEntryId4567'
      }
    }
  }
};

const paragraphEmbeddedEntryInline = {
  nodeType: 'paragraph',
  data: {
    target: {
      sys: {
        id: 'testParagraphId4567'
      }
    }
  },
  content: [paragraphLineOne, embeddedEntryInline]
};

const richTextEntryField = {
  value: {
    nodeType: 'document',
    content: [paragraphLine]
  }
};

const testSimpleObjects = [symbolSimpleObject, arraySimpleObject];

describe('content-diff-dialog helper methods', () => {
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

  describe('getEntryByDate(space, entryId, snapshotDate)', () => {

    test('returns entry object if a date is not passed in', async () => {
      const withoutDate = await getEntryByDate(sdk.space, entryOne.sys.id);
      expect(sdk.space.getEntry).toHaveBeenCalledTimes(1);
      expect(sdk.space.getEntry).toHaveBeenCalledWith(entryOne.sys.id);
      expect(sdk.space.getEntrySnapshots).not.toHaveBeenCalled();
      expect(JSON.stringify(withoutDate)).toBe(JSON.stringify(entryOne));
    });

    test('returns snapshot object if a date is passed in', async () => {
      const withDate = await getEntryByDate(sdk.space, entryOne.sys.id, new Date(snapshotOne.sys.updatedAt));
      expect(sdk.space.getEntry).not.toHaveBeenCalled();
      expect(sdk.space.getEntrySnapshots).toHaveBeenCalledTimes(1);
      expect(sdk.space.getEntrySnapshots).toHaveBeenCalledWith(entryOne.sys.id);
      expect(JSON.stringify(withDate)).toBe(JSON.stringify(snapshotOne));
    });
    
  });

  describe('createContentSimpleObjects(space, entry)', () => {
    test('returns array of objects with content info', async () => {
      const returnedObjects = [{
        id: contentTypeSymbolFieldOne.id,
        contentId: entryOne.sys.id,
        type: contentTypeSymbolFieldOne.type, 
        textType: false,
        value: contentTypeSymbolFieldOne['en-US'],
        arrayType: contentTypeSymbolFieldOne.items && contentTypeSymbolFieldOne.items.type,
        label: contentTypeSymbolFieldOne.name
      },
      {
        id: contentTypeSymbolFieldTwo.id,
        contentId: entryOne.sys.id,
        type: contentTypeSymbolFieldTwo.type, 
        textType: false,
        value: contentTypeSymbolFieldTwo['en-US'],
        arrayType: contentTypeSymbolFieldTwo.items && contentTypeSymbolFieldTwo.items.type,
        label: contentTypeSymbolFieldTwo.name
      }];
      const contentObjects = await createContentSimpleObjects(sdk.space, entryOne);
      expect(sdk.space.getEditorInterface).toHaveBeenCalledTimes(1);
      expect(sdk.space.getEditorInterface).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
      expect(sdk.space.getContentType).toHaveBeenCalledTimes(1);
      expect(sdk.space.getContentType).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
      expect(JSON.stringify(contentObjects)).toBe(JSON.stringify(returnedObjects));
    });
  });

  describe('createSimpleObjects(space, controls, entry, locale)', () => {
    describe('returns array of objects in this structure { id, type, value, arrayType, label, asset }', () => {
      test('without a locale passed in', async () => {
        const testRichText = _.omit(richTextSimpleObject, [getValue]);
        const testSymbol = _.omit(symbolSimpleObject, [getValue]);
        const testArray = _.omit(arraySimpleObject, [getValue, 'items']);
        const testLink = _.omit(linkSimpleObject, [getValue, '_fieldLocales']);
        const testText = _.omit(textMultiLineSimpleObject, [getValue]);
        const testEntrySimpleObjects = [testRichText, testSymbol, testArray, testLink, testText];

        const testObjects = await createSimpleObjects(sdk.space, testControls, testEntry);
        expect(sdk.space.getAsset).toHaveBeenCalledTimes(1);
        expect(sdk.space.getAsset).toHaveBeenCalledWith(linkSimpleObject._fieldLocales['en-US']._value.sys.id);
        expect(JSON.stringify(testObjects)).toBe(JSON.stringify(testEntrySimpleObjects));
      });

      test('with a locale passed in', async () => {
        const testRichText = _.omit(richTextSnapshotObject, ['en-US']);
        const testSymbol = _.omit(symbolSnapshotObject, ['en-US']);
        const testArray = _.omit(arraySnapshotObject, ['en-US', 'items']);
        const testLink = _.omit(linkSnapshotObject, ['en-US']);
        const testText = _.omit(textMultiLineSnapshotObject, ['en-US']);
        const testEntrySimpleObjects = [testRichText, testSymbol, testArray, testLink, testText];

        const testObjects = await createSimpleObjects(sdk.space, testSnapshotControls, testSnapshot, 'en-US');
        expect(sdk.space.getAsset).toHaveBeenCalledTimes(1);
        expect(sdk.space.getAsset).toHaveBeenCalledWith(linkSnapshotObject['en-US'].sys.id);
        expect(JSON.stringify(testObjects)).toBe(JSON.stringify(testEntrySimpleObjects));
      });
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
      const value = getValue(linkSimpleObject);
      expect(JSON.stringify(value)).toBe(JSON.stringify(linkSimpleObject.asset));
    });
    
  });

  describe('createHtmlForEntry(field = { id, type, value, arrayType, label, asset })', () => {
    test('returns html for entry label and values', () => {
      const { getByTestId } = render(<div dangerouslySetInnerHTML={{__html: createHtmlForEntry(symbolSimpleObject)}} />);
      expect(getByTestId(entryWrapTestId).getAttribute('class')).toMatch(new RegExp(symbolSimpleObject.type));
      expect(getByTestId(entryLabelTestId).textContent).toBe(symbolSimpleObject.label);
      expect(getByTestId(entryValueTestId).textContent).toBe(symbolSimpleObject.value);
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

  describe('createHtmlForArray(arrayField = { id, type, value, arrayType, label, asset })', () => {
    test('returns html for array label and all of its values in a list', () => {
      const { getByTestId, getAllByTestId, queryByTestId } = render(<div dangerouslySetInnerHTML={{__html: createHtmlForArray(arraySimpleObject)}} />);
      expect(getByTestId(arrayWrapTestId).getAttribute('class')).toMatch(new RegExp(arraySimpleObject.type));
      expect(getByTestId(arrayLabelTestId).textContent).toBe(arraySimpleObject.label);
      expect(queryByTestId(arrayListTestId)).toBeTruthy();
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arraySimpleObject.value.length);
      expect(getAllByTestId(arrayListItemTestId).every((item, i) => item.textContent === arraySimpleObject.value[i])).toBeTruthy();
    });
  });

  describe('getEmbeddedEntryValue(field = { id, type, value, arrayType, label, asset })', () => {
    test('returns html for entry label and values if the field\'s type is symbol', async () => {
      const { getByTestId } = render(<div dangerouslySetInnerHTML={{__html: await getEmbeddedEntryValue(symbolSimpleObject, sdk.space)}} />);
      await waitForElement(() => getByTestId(entryWrapTestId));
      await waitForElement(() => getByTestId(entryLabelTestId));
      await waitForElement(() => getByTestId(entryValueTestId));
      expect(getByTestId(entryWrapTestId).getAttribute('class')).toMatch(new RegExp(symbolSimpleObject.type));
      expect(getByTestId(entryLabelTestId).textContent).toBe(symbolSimpleObject.label);
      expect(getByTestId(entryValueTestId).textContent).toBe(symbolSimpleObject.value);
    });

    test('returns html for array label and all of its values in a list if the field\'s type is array', async () => {
      const { getByTestId, getAllByTestId, queryByTestId } = render(<div dangerouslySetInnerHTML={{__html: await getEmbeddedEntryValue(arraySimpleObject)}} />);
      await waitForElement(() => getByTestId(arrayWrapTestId));
      await waitForElement(() => getByTestId(arrayLabelTestId));
      await waitForElement(() => getByTestId(arrayListTestId));
      await waitForElement(() => getAllByTestId(arrayListItemTestId));
      expect(getByTestId(arrayWrapTestId).getAttribute('class')).toMatch(new RegExp(arraySimpleObject.type));
      expect(getByTestId(arrayLabelTestId).textContent).toBe(arraySimpleObject.label);
      expect(queryByTestId(arrayListTestId)).toBeTruthy();
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arraySimpleObject.value.length);
      expect(getAllByTestId(arrayListItemTestId).every((item, i) => item.textContent === arraySimpleObject.value[i])).toBeTruthy();
    });
  });

  describe('createHtmlForEmbeddedEntryLines(fields = [{ id, type, value, arrayType, label, asset }])', () => {
    test('returns html for all field labels and values in fields array', async () => {
      const { getByTestId, getAllByTestId, queryByTestId } = render(<div dangerouslySetInnerHTML={{__html: await createHtmlForEmbeddedEntryLines(testSimpleObjects, sdk.space)}} />);
      await waitForElement(() => getByTestId(entryWrapTestId));
      await waitForElement(() => getByTestId(entryLabelTestId));
      await waitForElement(() => getByTestId(entryValueTestId));
      await waitForElement(() => getByTestId(arrayWrapTestId));
      await waitForElement(() => getByTestId(arrayLabelTestId));
      await waitForElement(() => getByTestId(arrayListTestId));
      await waitForElement(() => getAllByTestId(arrayListItemTestId));
      expect(getByTestId(entryWrapTestId).getAttribute('class')).toMatch(new RegExp(symbolSimpleObject.type));
      expect(getByTestId(entryLabelTestId).textContent).toBe(symbolSimpleObject.label);
      expect(getByTestId(entryValueTestId).textContent).toBe(symbolSimpleObject.value);
      expect(getByTestId(arrayWrapTestId).getAttribute('class')).toMatch(new RegExp(arraySimpleObject.type));
      expect(getByTestId(arrayLabelTestId).textContent).toBe(arraySimpleObject.label);
      expect(queryByTestId(arrayListTestId)).toBeTruthy();
      expect(getAllByTestId(arrayListItemTestId).length).toBe(arraySimpleObject.value.length);
      expect(getAllByTestId(arrayListItemTestId).every((item, i) => item.textContent === arraySimpleObject.value[i])).toBeTruthy();
    });
  });

  describe('createRichTextLines(lines = [{ nodeType, content, data: { target: { sys: { id } } } }], space, environment, snapshotDate)', () => {
    describe('returns html for all rich text field lines of all types', () => {
      const embeddedAssetBlockTestId = "cdd-embedded-asset-block";
      const embeddedEntryNameTestId = "cdd-embedded-entry-name";
      const embeddedEntryWrapTestId = "cdd-embedded-entry-wrap";
      test('if line is of type embedded-asset-block without snapshot date', async () => {
        const lines = await createRichTextLines([embeddedAssetLine], sdk.space);
        expect(sdk.space.getAsset).toHaveBeenCalledTimes(1);
        expect(sdk.space.getAsset).toHaveBeenCalledWith(embeddedAssetLine.data.target.sys.id);
        const { getByTestId } = render(<div dangerouslySetInnerHTML={{__html: lines[0].formatted}} />);
        await waitForElement(() => getByTestId(embeddedAssetBlockTestId));
        expect(JSON.stringify(lines)).toBe(JSON.stringify([embeddedAssetLine]));
        expect(getByTestId(embeddedAssetBlockTestId).getAttribute('class')).toBe(embeddedAssetLine.nodeType);
      });

      test('if line is of type embedded-asset-block with snapshot date', async () => {
        const lines = await createRichTextLines([embeddedAssetLine], sdk.space, new Date());
        expect(sdk.space.getAsset).toHaveBeenCalledTimes(1);
        expect(sdk.space.getAsset).toHaveBeenCalledWith(embeddedAssetLine.data.target.sys.id);
        const { getByTestId } = render(<div dangerouslySetInnerHTML={{__html: lines[0].formatted}} />);
        await waitForElement(() => getByTestId(embeddedAssetBlockTestId));
        expect(JSON.stringify(lines)).toBe(JSON.stringify([embeddedAssetLine]));
        expect(getByTestId(embeddedAssetBlockTestId).getAttribute('class')).toBe(embeddedAssetLine.nodeType);
      });

      test('if line is of type embedded-entry-block without snapshot date', async () => {
        const lines = await createRichTextLines([embeddedEntryLine], sdk.space);
        const { getByTestId } = render(<div dangerouslySetInnerHTML={{__html: lines[0].formatted}} />);
        await waitForElement(() => getByTestId(embeddedEntryWrapTestId));
        await waitForElement(() => getByTestId(embeddedEntryNameTestId));

        expect(JSON.stringify(lines)).toBe(JSON.stringify([embeddedEntryLine]));
        expect(sdk.space.getEntry).toHaveBeenCalledTimes(1);
        expect(sdk.space.getEntry).toHaveBeenCalledWith(embeddedEntryLine.data.target.sys.id);
        expect(sdk.space.getContentType).toHaveBeenCalledTimes(1);
        expect(sdk.space.getContentType).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
        expect(getByTestId(embeddedEntryWrapTestId).getAttribute('class')).toBe(embeddedEntryLine.nodeType);
        expect(getByTestId(embeddedEntryNameTestId).textContent.trim()).toBe('Entry One');
      });

      test('if line is of type embedded-entry-block with snapshot date', async () => {
        const lines = await createRichTextLines([embeddedEntryLine], sdk.space, new Date(snapshotOne.sys.updatedAt));
        const { getByTestId } = render(<div dangerouslySetInnerHTML={{__html: lines[0].formatted}} />);
        await waitForElement(() => getByTestId(embeddedEntryWrapTestId));
        await waitForElement(() => getByTestId(embeddedEntryNameTestId));

        expect(JSON.stringify(lines)).toBe(JSON.stringify([embeddedEntryLine]));
        expect(sdk.space.getEntrySnapshots).toHaveBeenCalledTimes(1);
        expect(sdk.space.getEntrySnapshots).toHaveBeenCalledWith(embeddedEntryLine.data.target.sys.id);
        expect(sdk.space.getContentType).toHaveBeenCalledTimes(1);
        expect(sdk.space.getContentType).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
        expect(getByTestId(embeddedEntryWrapTestId).getAttribute('class')).toBe(embeddedEntryLine.nodeType);
        expect(getByTestId(embeddedEntryNameTestId).textContent.trim()).toBe('Entry One');
      });

      describe('if line is of type paragraph', () => {
        test('has no embedded entry inline and no snapshot date', async () => {
          const lines = await createRichTextLines([paragraphLine], sdk.space);

          expect(JSON.stringify(lines)).toBe(JSON.stringify([paragraphLine]));
          expect(sdk.space.getEntry).not.toHaveBeenCalled();
          expect(sdk.space.getContentType).not.toHaveBeenCalled();
        });
  
        test('has no embedded entry inline but has snapshot date', async () => {
          const lines = await createRichTextLines([paragraphLine], sdk.space, new Date(snapshotOne.sys.updatedAt));

          expect(JSON.stringify(lines)).toBe(JSON.stringify([paragraphLine]));
          expect(sdk.space.getEntry).not.toHaveBeenCalled();
          expect(sdk.space.getContentType).not.toHaveBeenCalled();
        });

        test('has embedded entry inline but no snapshot date', async () => {
          const lines = await createRichTextLines([paragraphEmbeddedEntryInline], sdk.space);
          const { getByTestId } = render(<div dangerouslySetInnerHTML={{__html: lines[0].content[1].formatted}} />);
          await waitForElement(() => getByTestId(embeddedEntryWrapTestId));
          await waitForElement(() => getByTestId(embeddedEntryNameTestId));
          
          expect(JSON.stringify(lines)).toBe(JSON.stringify([paragraphEmbeddedEntryInline]));
          expect(sdk.space.getEntry).toHaveBeenCalledTimes(1);
          expect(sdk.space.getEntry).toHaveBeenCalledWith(embeddedEntryInline.data.target.sys.id);
          expect(sdk.space.getContentType).toHaveBeenCalledTimes(1);
          expect(sdk.space.getContentType).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
          expect(getByTestId(embeddedEntryWrapTestId).getAttribute('class')).toBe(embeddedEntryInline.nodeType);
          expect(getByTestId(embeddedEntryNameTestId).textContent.trim()).toBe('Entry One');
        });
  
        test('has embedded entry inline and has snapshot date', async () => {
          const lines = await createRichTextLines([paragraphEmbeddedEntryInline], sdk.space, new Date(snapshotOne.sys.updatedAt));
          const { getByTestId } = render(<div dangerouslySetInnerHTML={{__html: lines[0].content[1].formatted}} />);
          await waitForElement(() => getByTestId(embeddedEntryWrapTestId));
          await waitForElement(() => getByTestId(embeddedEntryNameTestId));
          
          expect(JSON.stringify(lines)).toBe(JSON.stringify([paragraphEmbeddedEntryInline]));
          expect(sdk.space.getEntrySnapshots).toHaveBeenCalledTimes(1);
          expect(sdk.space.getEntrySnapshots).toHaveBeenCalledWith(embeddedEntryInline.data.target.sys.id);
          expect(sdk.space.getContentType).toHaveBeenCalledTimes(1);
          expect(sdk.space.getContentType).toHaveBeenCalledWith(entryOne.sys.contentType.sys.id);
          expect(getByTestId(embeddedEntryWrapTestId).getAttribute('class')).toBe(embeddedEntryInline.nodeType);
          expect(getByTestId(embeddedEntryNameTestId).textContent.trim()).toBe('Entry One');
        });
      });
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
      const id = getId(linkSimpleObject);
      expect(id).toBe(linkSimpleObject.id);
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
      const type = getType(linkSimpleObject);
      expect(type).toBe(linkSimpleObject.type);
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
      const label = getLabel(linkSimpleObject);
      expect(label).toBe(linkSimpleObject.label);
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
      const arrayType = getArrayType(linkSimpleObject);
      expect(arrayType).toBe(linkSimpleObject.arrayType);
    });

    test('returns array type of rich text object', () => {
      const arrayType = getArrayType(richTextSimpleObject);
      expect(arrayType).toBe(richTextSimpleObject.arrayType);
    });
  });

  describe('getContent(field = { id, type, value, arrayType, label }, environment, snapshotDate, snapshot)', () => {
    test('returns an object with current and old html values of rich text field', async () => {
      const content = await getContent(richTextEntryField, sdk.space, new Date(snapshotOne.sys.updatedAt), richTextEntryField);
      expect(content.currentValue).toBeTruthy();
      expect(content.oldValue).toBeTruthy();
      expect(content.currentValue === content.oldValue).toBeTruthy();
    });
  });

  describe('createDiffFields(fields, snapshots, environment, snapshotDate)', () => {
    describe('creates object with this structure { id, type, label, content: { currentValue, oldValue }, currentValue, oldValue, arrayType }', () => {
      test('when there is a rich text field', async () => {
        const fields = await createDiffFields([richTextSimpleObject], [richTextSimpleObject], sdk.space, new Date(snapshotOne.sys.updatedAt));
        expect(fields[0]).toBeTruthy();
        expect(fields[0].id).toBe(richTextSimpleObject.id);
        expect(fields[0].type).toBe(richTextSimpleObject.type);
        expect(fields[0].label).toBe(richTextSimpleObject.label);
        expect(fields[0].content).toBeTruthy();
        expect(fields[0].content.currentValue).toBeTruthy();
        expect(fields[0].content.oldValue).toBeTruthy();
        expect(fields[0].content.currentValue === fields[0].content.oldValue).toBeTruthy();
        expect(fields[0].currentValue).toBeFalsy();
        expect(fields[0].oldValue).toBeFalsy();
        expect(fields[0].arrayType).toBeFalsy();
      });

      test('when there is a symbol field', async () => {
        const fields = await createDiffFields([symbolSimpleObject], [symbolSimpleObject], sdk.space, new Date(snapshotOne.sys.updatedAt));
        expect(fields[0]).toBeTruthy();
        expect(fields[0].id).toBe(symbolSimpleObject.id);
        expect(fields[0].type).toBe(symbolSimpleObject.type);
        expect(fields[0].label).toBe(symbolSimpleObject.label);
        expect(fields[0].content).toBeFalsy();
        expect(fields[0].currentValue).toBeTruthy();
        expect(fields[0].oldValue).toBeTruthy();
        expect(fields[0].currentValue === fields[0].oldValue).toBeTruthy();
        expect(fields[0].arrayType).toBeFalsy();
      });

      test('when there is a array field', async () => {
        const fields = await createDiffFields([arraySimpleObject], [arraySimpleObject], sdk.space, new Date(snapshotOne.sys.updatedAt));
        expect(fields[0]).toBeTruthy();
        expect(fields[0].id).toBe(arraySimpleObject.id);
        expect(fields[0].type).toBe(arraySimpleObject.type);
        expect(fields[0].label).toBe(arraySimpleObject.label);
        expect(fields[0].content).toBeFalsy();
        expect(fields[0].currentValue).toBeTruthy();
        expect(fields[0].oldValue).toBeTruthy();
        expect(fields[0].currentValue === fields[0].oldValue).toBeTruthy();
        expect(fields[0].arrayType).toBe(arraySimpleObject.arrayType);
      });

      test('when there is a link field', async () => {
        const fields = await createDiffFields([linkSimpleObject], [linkSimpleObject], sdk.space, new Date(snapshotOne.sys.updatedAt));
        expect(fields[0]).toBeTruthy();
        expect(fields[0].id).toBe(linkSimpleObject.id);
        expect(fields[0].type).toBe(linkSimpleObject.type);
        expect(fields[0].label).toBe(linkSimpleObject.label);
        expect(fields[0].content).toBeFalsy();
        expect(fields[0].currentValue).toBeTruthy();
        expect(fields[0].oldValue).toBeTruthy();
        expect(fields[0].currentValue === fields[0].oldValue).toBeTruthy();
        expect(fields[0].arrayType).toBeFalsy();
      });
    });
  });

  describe('addRemovedOldFields(fields, snapshots)', () => {
    test('adds old fields that have been removed', () => {
      const fields = addRemovedOldFields([richTextSimpleObject], [symbolSimpleObject]);
      expect(fields[1]).toBeTruthy();
      expect(fields[1].id).toBe(symbolSimpleObject.id);
      expect(fields[1].type).toBe(symbolSimpleObject.type);
      expect(fields[1].label).toBe(symbolSimpleObject.label);
      expect(fields[1].content).toBeFalsy();
      expect(fields[1].currentValue).toBeFalsy();
      expect(fields[1].oldValue).toBeTruthy();
      expect(fields[1].arrayType).toBeFalsy();
    });
  });

  describe('getTextValue(field)', () => {
    test('wraps text value in pre tags if code tags are present', () => {
      const testText = {
        value: '<code>this is wraped in code tags</code>'
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
        textType: 'markdown'
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
        textType: 'multipleLine'
      };
      const value = getTextValue(testText);
      expect(value.replace(testText.value, '')).toBe('<pre></pre>');
    });
  });

});

describe('<DialogExtension sdk={sdk} />', () => {
  describe('initialize()', () => {

  });

  describe('render()', () => {

  });
});