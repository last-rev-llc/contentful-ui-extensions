const mockSeoJson = {
  "title":{"name":"title","value":"Last Rev: Connecting the Modern Web"},
  "robots":{"name":"robots","value":"index,follow"},
  "description":{"name":"description","value":"This is my metta description"},
  "keywords":{"name":"keywords","value":"These, are my, keywords"},
  "og:title":{"name":"og:title","value":"Social Sharing Title"},
  "og:description":{"name":"og:description","value":"Social Sharing Description"},
  
  "twitter:image":{"name":"twitter:image","value":"{\"sys\":{\"space\":{\"sys\":{\"type\":\"Link\",\"linkType\":\"Space\",\"id\":\"9o4l1mrd1tci\"}},\"id\":\"5VwseUvM96DL4TCKH42IM6\",\"type\":\"Asset\",\"createdAt\":\"2019-08-30T23:33:29.011Z\",\"updatedAt\":\"2019-08-30T23:33:40.228Z\",\"environment\":{\"sys\":{\"id\":\"master\",\"type\":\"Link\",\"linkType\":\"Environment\"}},\"publishedVersion\":4,\"publishedAt\":\"2019-08-30T23:33:40.228Z\",\"firstPublishedAt\":\"2019-08-30T23:33:40.228Z\",\"createdBy\":{\"sys\":{\"type\":\"Link\",\"linkType\":\"User\",\"id\":\"6Ntte0Bfc9VTOdBwRFarLv\"}},\"updatedBy\":{\"sys\":{\"type\":\"Link\",\"linkType\":\"User\",\"id\":\"6Ntte0Bfc9VTOdBwRFarLv\"}},\"publishedCounter\":1,\"version\":5,\"publishedBy\":{\"sys\":{\"type\":\"Link\",\"linkType\":\"User\",\"id\":\"6Ntte0Bfc9VTOdBwRFarLv\"}}},\"fields\":{\"title\":{\"en-US\":\"Screen Shot 2019-08-30 at 1.10.13 PM\"},\"file\":{\"en-US\":{\"url\":\"//images.ctfassets.net/9o4l1mrd1tci/5VwseUvM96DL4TCKH42IM6/d05b9b4773e44de340dc50051c8b5bf2/Screen_Shot_2019-08-30_at_1.10.13_PM.png\",\"details\":{\"size\":183321,\"image\":{\"width\":1948,\"height\":742}},\"fileName\":\"Screen Shot 2019-08-30 at 1.10.13 PM.png\",\"contentType\":\"image/png\"}}}}"}
};
const sdk = {
  field: {
    getValue: () => {
      return mockSeoJson;
    },
    setValue: () => {
      return null;
    },
    locale: 'en-US',
  },
  dialogs: {
    selectSingleAsset: (options) => new Promise((resolve, reject) => {
      resolve({
        sys: {
          id: '1213456',
        },
        fields: {
          file: {
            'en-US': {
              url: '//placehold.it/600x315'
            }
          },
          title: {
            'en-US': 'The is the placeholder image'
          }
        }
      });
    })
  }
};

export default sdk;