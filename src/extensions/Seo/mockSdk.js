const mockSeoJson = {
  "title":{"name":"title","value":"Last Rev: Connecting the Modern Web"},
  "robots":{"name":"robots","value":"index,follow"},
  "description":{"name":"description","value":"Me non paenitet nullum festiviorem excogitasse ad hoc. Unam incolunt Belgae, aliam Aquitani, tertiam. Inmensae subtilitatis, obscuris et malesuada fames."},
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
  },
  platformAlpha: {
    app: {
      getParameters: async () => {
        return {
          hello: 'world'
        };
      },
      onConfigure: (fn) => {
        fn();
      },
      setReady: () => {
        return null;
      }
    }
  },
  space: {
    getContentTypes: async () => {
      return {
        items: [
          {"sys":{"space":{"sys":{"type":"Link","linkType":"Space","id":"9o4l1mrd1tci"}},"id":"seoApp","type":"ContentType","createdAt":"2020-01-16T19:49:47.854Z","updatedAt":"2020-01-16T19:49:48.265Z","environment":{"sys":{"id":"master","type":"Link","linkType":"Environment"}},"publishedVersion":1,"publishedAt":"2020-01-16T19:49:48.265Z","firstPublishedAt":"2020-01-16T19:49:48.265Z","createdBy":{"sys":{"type":"Link","linkType":"User","id":"6Ntte0Bfc9VTOdBwRFarLv"}},"updatedBy":{"sys":{"type":"Link","linkType":"User","id":"6Ntte0Bfc9VTOdBwRFarLv"}},"publishedCounter":1,"version":2,"publishedBy":{"sys":{"type":"Link","linkType":"User","id":"6Ntte0Bfc9VTOdBwRFarLv"}}},"displayField":"title","name":"SEO App","description":"","fields":[{"id":"title","name":"Title","type":"Symbol","localized":false,"required":false,"validations":[],"disabled":false,"omitted":false},{"id":"description","name":"Description","type":"Symbol","localized":false,"required":false,"validations":[],"disabled":false,"omitted":false},{"id":"mainImage","name":"Main Image","type":"Link","localized":false,"required":false,"validations":[],"disabled":false,"omitted":false,"linkType":"Asset"},{"id":"seo","name":"SEO","type":"Object","localized":false,"required":false,"validations":[],"disabled":false,"omitted":false}]},
          {"sys":{"space":{"sys":{"type":"Link","linkType":"Space","id":"9o4l1mrd1tci"}},"id":"uiExtensionShowcase","type":"ContentType","createdAt":"2019-10-24T05:20:32.176Z","updatedAt":"2020-01-15T17:56:39.260Z","environment":{"sys":{"id":"master","type":"Link","linkType":"Environment"}},"publishedVersion":57,"publishedAt":"2020-01-15T17:56:39.260Z","firstPublishedAt":"2019-10-24T05:20:32.762Z","createdBy":{"sys":{"type":"Link","linkType":"User","id":"6Ntte0Bfc9VTOdBwRFarLv"}},"updatedBy":{"sys":{"type":"Link","linkType":"User","id":"6Ntte0Bfc9VTOdBwRFarLv"}},"publishedCounter":29,"version":58,"publishedBy":{"sys":{"type":"Link","linkType":"User","id":"6Ntte0Bfc9VTOdBwRFarLv"}}},"displayField":"colorPicker","name":"UI Extension Showcase","description":"","fields":[{"id":"layoutBuilder","name":"Layout Builder","type":"Array","localized":false,"required":false,"validations":[],"disabled":true,"omitted":false,"items":{"type":"Link","validations":[],"linkType":"Entry"}},{"id":"layoutConfig","name":"Layout Config","type":"Object","localized":false,"required":false,"validations":[],"disabled":true,"omitted":false},{"id":"colorPicker","name":"Color Picker","type":"Symbol","localized":false,"required":false,"validations":[{"in":["#FFFFFF","#FF0000","#00FF00","#000000"]}],"disabled":false,"omitted":false},{"id":"seoFields","name":"SEO Fields","type":"Object","localized":false,"required":false,"validations":[],"disabled":false,"omitted":false},{"id":"categories","name":"Categories","type":"Array","localized":false,"required":false,"validations":[],"disabled":true,"omitted":false,"items":{"type":"Link","validations":[],"linkType":"Entry"}},{"id":"optimizelyResults","name":"Optimizely Results","type":"Symbol","localized":false,"required":false,"validations":[],"disabled":true,"omitted":false},{"id":"templates","name":"Templates","type":"Array","localized":false,"required":false,"validations":[],"disabled":true,"omitted":false,"items":{"type":"Link","validations":[],"linkType":"Entry"}}]}
        ]
      };
    }
  },
  location: {
    is: () => {
      return true;
    }
  }
};

export default sdk;