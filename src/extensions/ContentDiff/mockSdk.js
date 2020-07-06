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
  name: 'Content Type Symbol Field One'
};

const contentTypeSymbolFieldTwo = {
  id: 'contentTypeSymbolFieldTwo',
  type: 'Symbol',
  name: 'Content Type Symbol Field Two'
};

const arrayField = {

};

const entryOne = {
  sys: {
    id: '123456',
    contentType: {
      sys: {
        id: '765432'
      }
    }
  },
  fields: [entrySymbolFieldOne, entrySymbolFieldTwo],
  getSnapshots: () => new Promise((resolve, reject) => {
    resolve({
      items: [{
        sys: {
          updatedAt: '2020-06-29T23:04:28.809Z'
        },
        snapshot: {
          fields: [entrySymbolFieldOne, entrySymbolFieldTwo]
        }
      },
      {
        sys: {
          updatedAt: '2020-06-28T23:04:28.809Z'
        },
        snapshot: {
          fields: [entrySymbolFieldOne, entrySymbolFieldTwo]
        }
      }]
    });
  })
};

const sdk = {
  environment: {
    getEntry: (entryId) => new Promise((resolve, reject) => {
      resolve(entryOne);
    }),
    getContentType: (contentTypeId) => new Promise((resolve, reject) => {
      resolve({
        sys: {
          id: contentTypeId
        },
        fields: [contentTypeSymbolFieldOne, contentTypeSymbolFieldTwo]
      });
    })
  }
};

export {
  richTextField,
  entrySymbolFieldOne,
  entrySymbolFieldTwo,
  contentTypeSymbolFieldOne,
  contentTypeSymbolFieldTwo,
  arrayField,
  entryOne
};

export default sdk;