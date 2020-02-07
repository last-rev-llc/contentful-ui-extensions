import mockContentfulAsset from './mockContentfulAsset';
import mockContentfulContentType from './mockContentfulContentType';

const sdk = {
  init: (mockFieldValue, mockAppConfig) => {
    return {
      field: {
        getValue: jest.fn().mockImplementation(() => {
          return {
            ...mockFieldValue
          };
        }),
        setValue: jest.fn().mockResolvedValue({
          hello: "world"
        }),
        locale: "en-US"
      },
      dialogs: {
        selectSingleAsset: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            resolve(mockContentfulAsset.success);
            reject(mockContentfulAsset.error);
          });
        })
      },
      platformAlpha: {
        app: {
          getParameters: jest.fn().mockImplementation(async appSettings => {
            return {
              ...mockAppConfig,
              appSettings
            };
          }),
          onConfigure: jest.fn().mockImplementation(fn => {
            fn();
          }),
          setReady: jest.fn().mockImplementation(() => {
            return null;
          })
        }
      },
      space: {
        getContentTypes: jest.fn().mockImplementation(async () => {
          return {
            items: mockContentfulContentType.array
          };
        }),
        getAsset: jest.fn().mockImplementation(type => {
          return new Promise((resolve, reject) => {
            if (type === "reject") {
              return resolve(mockContentfulAsset.error);
            }
            return resolve(mockContentfulAsset.success);
          });
        })
      },
      location: {
        is: () => {
          return true;
        }
      },
      locales: {
        available: ["en-US"],
        default: "en-US",
        names: { "en-US": "English (United States)" },
        fallbacks: {},
        optional: { "en-US": false },
        direction: { "en-US": "ltr" }
      },
      entry: {
        fields: {
          title: {
            onValueChanged: jest.fn(),
          },
          description: {
            onValueChanged: jest.fn(),
          }
        }
      }
    };
  }
};

export default sdk;