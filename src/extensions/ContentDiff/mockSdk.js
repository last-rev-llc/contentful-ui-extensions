const entrySymbolFieldOne = {
  'en-US': 'symbol field 1'
};

const entrySymbolFieldTwo = {
  'en-US': 'symbol field 2'
};

const contentTypeSymbolFieldOne = {
  id: 'contentTypeSymbolFieldOne',
  type: 'Symbol',
  name: 'Content Type Symbol Field One',
  'en-US': 'symbol field 1'
};

const contentTypeSymbolFieldTwo = {
  id: 'contentTypeSymbolFieldTwo',
  type: 'Symbol',
  name: 'Content Type Symbol Field Two',
  'en-US': 'symbol field 2'
};

const assetFieldOne = {
  fields: {
    title: {
      'en-US': 'Asset Field One'
    },
    file: {
      'en-US': {
        url: 'http://localhost/images/exampleone.jpeg'
      }
    }
  },
};

const snapshotOne = {
  sys: {
    updatedAt: '2020-06-29T23:04:28.809Z',
    id: '123456',
    contentType: {
      sys: {
        id: 'entryOne'
      }
    }
  },
  snapshot: {
    fields: {contentTypeSymbolFieldOne, contentTypeSymbolFieldTwo},
    sys: {
      updatedAt: '2020-06-29T23:04:28.809Z',
      id: '123456',
      contentType: {
        sys: {
          id: 'entryOne'
        }
      }
    }
  }
};

const snapshotTwo = {
  sys: {
    updatedAt: '2020-06-28T23:04:28.809Z',
    id: '123456',
    contentType: {
      sys: {
        id: 'entryOne'
      }
    }
  },
  snapshot: {
    fields: {entrySymbolFieldOne, entrySymbolFieldTwo},
    sys: {
      updatedAt: '2020-06-29T23:04:28.809Z',
      id: '123456',
      contentType: {
        sys: {
          id: 'entryOne'
        }
      }
    }
  }
};

const entryOne = {
  sys: {
    id: '123456',
    contentType: {
      sys: {
        id: 'entryOne'
      }
    }
  },
  snapshot: {
    sys: {
      id: '123456',
      contentType: {
        sys: {
          id: 'entryOne'
        }
      }
    }
  },
  fields: { contentTypeSymbolFieldOne, contentTypeSymbolFieldTwo }
};

const arraySimpleObject = {
  id: 'arraySimpleObject',
  type: 'Array', 
  value: ['test', 'testing', 'tested'], 
  arrayType: 'Symbol',
  label: 'Array Simple Object',
  getValue: async () => arraySimpleObject.value,
  items: {
    type: 'Symbol'
  }
};

const mockSdk = {
  space: {
    getEntrySnapshots: async () => ({ items: [snapshotOne, snapshotTwo] }),
    getEntry: async (entryId) => entryOne,
    getContentType: async (contentTypeId) => ({
      sys: {
        id: contentTypeId
      },
      fields: [contentTypeSymbolFieldOne, contentTypeSymbolFieldTwo]
    }),
    getEditorInterface: async (contentTypeId) => ({
      controls: [{
        fieldId: 'textFieldOne',
        widgetId: 'multipleLine'
      }]
    }),
    getAsset: async (assetId) => assetFieldOne
  },
  ids: {
    space: 'space',
    environment: 'master'
  },
  location: {
    is: () => false
  },
  window: {
    startAutoResizer: () => true
  },
  entry: {
    fields: {}
  }
};

export {
  assetFieldOne,
  arraySimpleObject,
  entrySymbolFieldOne,
  entrySymbolFieldTwo,
  contentTypeSymbolFieldOne,
  contentTypeSymbolFieldTwo,
  entryOne,
  snapshotOne,
  snapshotTwo
};

export default mockSdk;