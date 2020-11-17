import sdk, {
  assetFieldOne,
  arraySimpleObject,
  contentTypeSymbolFieldOne,
  contentTypeSymbolFieldTwo,
  entryOne,
  snapshotOne,
  snapshotTwo
} from '../mockSdk';

export const testContentType = {
  sys: {
    id: 'Testid123'
  },
  fields: [contentTypeSymbolFieldOne, contentTypeSymbolFieldTwo]
};

export const testEditorInterface = {
  controls: [
    {
      fieldId: 'textMultiLineSimpleObject',
      widgetId: 'multipleLine'
    }
  ]
};

export const entryWrapTestId = 'cdd-entry-wrap';
export const entryLabelTestId = 'cdd-entry-label';
export const entryValueTestId = 'cdd-entry-value';
export const arrayWrapTestId = 'cdd-array-wrap';
export const arrayLabelTestId = 'cdd-array-label';

export const richTextEmbeddedEntryInfo = {
  nodeType: 'embedded-entry-block',
  data: {
    target: {
      sys: {
        id: 'Test123456'
      }
    }
  }
};

export const richTextEmbeddedAssetInfo = {
  nodeType: 'embedded-asset-block',
  data: {
    target: {
      sys: {
        id: 'Test6789076654'
      }
    }
  }
};

export const richTextParagraphTextInfo = {
  value: 'Rich Text Paragraph Text Info',
  nodeType: 'text'
};

export const richTextParagraphEmbeddedEntryInfo = {
  nodeType: 'embedded-entry-inline',
  data: {
    target: {
      sys: {
        id: 'Test678907'
      }
    }
  }
};

export const richTextEmbeddedParagraphInfo = {
  content: [richTextParagraphTextInfo, richTextParagraphEmbeddedEntryInfo]
};

export const richTextParagraphInfo = {
  content: [richTextParagraphTextInfo]
};

export const richTextFieldContent = {
  content: [richTextEmbeddedEntryInfo, richTextEmbeddedAssetInfo, richTextParagraphInfo, richTextEmbeddedParagraphInfo]
};

export const richTextSimpleObject = {
  id: 'richTextSimpleObject',
  type: 'RichText',
  value: richTextFieldContent,
  label: 'Rich Text Simple Object',
  getValue: jest.fn(() => richTextSimpleObject.value)
};

export const symbolSimpleObject = {
  id: 'symbolSimpleObject',
  type: 'Symbol',
  value: 'this is test text',
  label: 'Symbol Simple Object',
  getValue: jest.fn(() => symbolSimpleObject.value)
};

export const textMultiLineSimpleObject = {
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

export const assetLinkSimpleObject = {
  id: 'linkSimpleObject',
  type: 'Link',
  value: 'linkSimpleObject',
  label: 'Link Simple Object',
  linkType: 'Asset',
  asset: assetFieldOne,
  getValue: jest.fn(() => assetLinkSimpleObject.value),
  _fieldLocales: {
    'en-US': {
      _value: {
        sys: {
          id: 'TestAssetID123456'
        }
      }
    }
  }
};

export const richTextSnapshotObject = {
  'id': 'richTextSnapshotObject',
  'type': 'RichText',
  'value': richTextFieldContent,
  'label': 'Rich Text Snapshot Object',
  'en-US': richTextFieldContent
};

export const symbolSnapshotObject = {
  'id': 'symbolSnapshotObject',
  'type': 'Symbol',
  'value': 'this is test text',
  'label': 'Symbol Snapshot Object',
  'en-US': 'this is test text'
};

export const textMultiLineSnapshotObject = {
  'id': 'textMultiLineSnapshotObject',
  'type': 'Text',
  'textType': 'multipleLine',
  'value': `
    this is multiLine text text
    here is another line
  `,
  'label': 'Text Multi Line Snapshot Object',
  'en-US': `
    this is multiLine text text
    here is another line
  `
};

export const arraySnapshotObject = {
  'id': 'arraySnapshotObject',
  'type': 'Array',
  'value': ['test', 'testing', 'tested'],
  'arrayType': 'Symbol',
  'label': 'Array Snapshot Object',
  'en-US': ['test', 'testing', 'tested'],
  'items': {
    type: 'Symbol'
  }
};

export const assetLinkSnapshotObject = {
  'id': 'linkSnapshotObject',
  'type': 'Link',
  'value': {
    sys: {
      id: 'TestAssetID123456'
    }
  },
  'label': 'Link Snapshot Object',
  'linkType': 'asset',
  'asset': assetFieldOne,
  'en-US': {
    sys: {
      id: 'TestAssetID123456'
    }
  }
};

export const richTextSnapshotControl = {
  field: {
    type: richTextSnapshotObject.type,
    name: richTextSnapshotObject.label
  },
  fieldId: richTextSnapshotObject.id
};

export const symbolSnapshotControl = {
  field: {
    type: symbolSnapshotObject.type,
    name: symbolSnapshotObject.label
  },
  fieldId: symbolSnapshotObject.id
};

export const arraySnapshotControl = {
  field: {
    type: arraySnapshotObject.type,
    name: arraySnapshotObject.label
  },
  fieldId: arraySnapshotObject.id
};

export const assetLinkSnapshotControl = {
  field: {
    type: assetLinkSnapshotObject.type,
    name: assetLinkSnapshotObject.label,
    linkType: assetLinkSnapshotObject.linkType
  },
  fieldId: assetLinkSnapshotObject.id
};

export const textMultiLineSnapshotControl = {
  field: {
    type: textMultiLineSnapshotObject.type,
    name: textMultiLineSnapshotObject.label
  },
  fieldId: textMultiLineSnapshotObject.id,
  widgetId: textMultiLineSnapshotObject.textType
};

export const richTextControl = {
  field: {
    type: richTextSimpleObject.type,
    name: richTextSimpleObject.label
  },
  fieldId: richTextSimpleObject.id
};

export const symbolControl = {
  field: {
    type: symbolSimpleObject.type,
    name: symbolSimpleObject.label
  },
  fieldId: symbolSimpleObject.id
};

export const arrayControl = {
  field: {
    type: arraySimpleObject.type,
    name: arraySimpleObject.label
  },
  fieldId: arraySimpleObject.id
};

export const assetLinkControl = {
  field: {
    type: assetLinkSimpleObject.type,
    name: assetLinkSimpleObject.label,
    linkType: assetLinkSimpleObject.linkType
  },
  fieldId: assetLinkSimpleObject.id
};

export const textMultiLineControl = {
  field: {
    type: textMultiLineSimpleObject.type,
    name: textMultiLineSimpleObject.label
  },
  fieldId: textMultiLineSimpleObject.id,
  widgetId: textMultiLineSimpleObject.textType
};

export const testControls = [richTextControl, symbolControl, arrayControl, assetLinkControl, textMultiLineControl];

export const testSnapshotControls = [
  richTextSnapshotControl,
  symbolSnapshotControl,
  arraySnapshotControl,
  assetLinkSnapshotControl,
  textMultiLineSnapshotControl
];

export const testEntry = {
  richTextSimpleObject,
  symbolSimpleObject,
  arraySimpleObject,
  linkSimpleObject: assetLinkSimpleObject,
  textMultiLineSimpleObject
};

export const testSnapshot = {
  richTextSnapshotObject,
  symbolSnapshotObject,
  arraySnapshotObject,
  linkSnapshotObject: assetLinkSnapshotObject,
  textMultiLineSnapshotObject
};

export const paragraphLineOne = { nodeType: 'text', value: 'line 1', marks: [] };

export const embeddedAssetLine = {
  nodeType: 'embedded-asset-block',
  data: {
    target: {
      sys: {
        id: 'testAssetId4567'
      }
    }
  }
};

export const embeddedEntryLine = {
  nodeType: 'embedded-entry-block',
  data: {
    target: {
      sys: {
        id: 'testEntryId4567'
      }
    }
  }
};

export const paragraphLine = {
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

export const embeddedEntryInline = {
  nodeType: 'embedded-entry-inline',
  data: {
    target: {
      sys: {
        id: 'testInlineEntryId4567'
      }
    }
  }
};

export const paragraphEmbeddedEntryInline = {
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

export const richTextEntryField = {
  value: {
    nodeType: 'document',
    content: [paragraphLine]
  }
};

export const testSimpleObjects = [symbolSimpleObject, arraySimpleObject];
