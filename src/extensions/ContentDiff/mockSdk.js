const richTextField = {

};

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

const arrayField = {

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
  fields: { contentTypeSymbolFieldOne, contentTypeSymbolFieldTwo },
  getSnapshots: async () => ({ items: [snapshotOne, snapshotTwo] })
};

const sdk = {
  environment: {
    getEntry: async (entryId) => entryOne,
    getAsset: async (assetId) => assetFieldOne,
    getContentType: async (contentTypeId) => ({
      sys: {
        id: contentTypeId
      },
      fields: [contentTypeSymbolFieldOne, contentTypeSymbolFieldTwo]
    })
  },
  space: {
    getEditorInterface: async (contentTypeId) => ({
      controls: [{
        fieldId: 'textFieldOne',
        widgetId: 'multipleLine'
      }]
    })
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
  richTextField,
  entrySymbolFieldOne,
  entrySymbolFieldTwo,
  contentTypeSymbolFieldOne,
  contentTypeSymbolFieldTwo,
  arrayField,
  entryOne,
  snapshotOne,
  snapshotTwo
};

export default sdk;