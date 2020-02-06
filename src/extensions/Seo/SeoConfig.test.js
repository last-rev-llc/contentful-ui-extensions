import React from 'react';
import _ from 'lodash';
import { render, cleanup, fireEvent, wait, configure } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SeoConfig from './SeoConfig';

import mockContentfulSdk from '../../__mocks__/mockContentfulSdk';
import mockContentfulContentType from '../../__mocks__/mockContentfulContentType';
import mockAppConfig from './__mocks__/mockAppConfig';
import mockContentfulAsset from '../../__mocks__/mockContentfulAsset';

let sdk;

configure({
  testIdAttribute: 'data-test-id',
});

beforeEach(() => {
  sdk = mockContentfulSdk.init(null, mockAppConfig);
});

afterEach(() => {
  cleanup();
});

describe('<SeoConfig />', () => {
  describe('initialize with componentDidMount()', () => {
    test('should render inital state with no value for parameters', async () => {
      const mockgetParameters = jest.fn();
      sdk = mockContentfulSdk.init(null, {});
      const { queryByTestId, queryAllByTestId } = render(<SeoConfig sdk={{
        ...sdk,
        platformAlpha: {
          ...sdk.platformAlpha,
          app: {
            ...sdk.platformAlpha.app,
            getParameters: mockgetParameters,
          }
        }
      }} />);
      await wait();
      expect(mockgetParameters).toHaveBeenCalled();
      expect(queryAllByTestId('SeoConfig-option-contentType'))
        .toHaveLength(mockContentfulContentType.array.length);
      expect(queryAllByTestId('SeoConfig-tablerow-contentType'))
        .toHaveLength(0);
      expect(queryByTestId('SeoConfig-siteName').value)
        .toBeFalsy();
      expect(queryByTestId('SingleAssetWithButton-Button'))
        .toBeTruthy();
    });

    test('should render inital state with default parameter values correctly', async () => {
      const { queryByTestId, queryAllByTestId } = render(<SeoConfig sdk={{
        ...sdk,
        space: {
          ...sdk.space,
          getAsset: jest.fn().mockResolvedValue(mockContentfulAsset.success),
        }
      }} />);
      await wait();
      expect(sdk.platformAlpha.app.getParameters).toHaveBeenCalled();
      expect(queryAllByTestId('SeoConfig-option-contentType'))
        .toHaveLength(mockContentfulContentType.array.length - 1);
      expect(queryAllByTestId('SeoConfig-tablerow-contentType'))
        .toHaveLength(1);
      expect(queryByTestId('SeoConfig-siteName').value)
        .toBeTruthy();
      expect(queryByTestId('SingleAssetWithButton-AssetCard'))
        .toBeTruthy();
    });
  });

  describe('content type dropdown', () => {
    test('content types that are selected should not show up in the dropdown', async () => {
      const { queryByTestId } = render(<SeoConfig sdk={sdk} />);
      const {editorInterface} = mockAppConfig;
      await wait();
      const contentTypeIds = _.keys(editorInterface);
      let dropDown = queryByTestId('SeoConfig-select-contentType').getElementsByTagName('select')[0];
      let dropDownOptionValues = _.map(dropDown.children, (option) => {
        return option.value;
      });
      expect(_.difference(contentTypeIds, dropDownOptionValues))
        .toEqual(contentTypeIds);

      fireEvent.change(dropDown, {
        target: {
          value: dropDownOptionValues[1],
        }
      });
      contentTypeIds.push(dropDownOptionValues[1]);
      [dropDown] = queryByTestId('SeoConfig-select-contentType').getElementsByTagName('select');
      dropDownOptionValues = _.map(dropDown.children, (option) => {
        return option.value;
      });
      await wait();
      expect(_.difference(contentTypeIds, dropDownOptionValues))
        .toEqual(contentTypeIds);
    });
  });

  describe('content type table renderDefaultFieldConfig()', () => {
    test('each row should have correct defaultField options on render', async () => {
      const { queryAllByTestId } = render(<SeoConfig sdk={sdk} />);
      await wait();
      expect(queryAllByTestId('SeoConfig-select-fields').length).toEqual(4);
      expect(queryAllByTestId('SeoConfig-select-fields')[0].value)
        .toEqual(mockAppConfig.editorInterface.seoApp.controls[0].fieldId);
      expect(queryAllByTestId('SeoConfig-select-fields')[1].value)
        .toEqual(mockAppConfig.editorInterface.seoApp.controls[0].settings.defaultPageTitleField);
      expect(queryAllByTestId('SeoConfig-select-fields')[2].value)
        .toEqual(mockAppConfig.editorInterface.seoApp.controls[0].settings.defaultDescriptionField);
      expect(queryAllByTestId('SeoConfig-select-fields')[3].value)
        .toEqual(mockAppConfig.editorInterface.seoApp.controls[0].settings.defaultSocialImageField);
    });

    test.todo('should change the value when selected');
  });

  describe('content type table renderContentTypeConfigRow()', () => {
    test('should add a new row when a new content type is selected', async () => {
      const { queryByTestId, queryAllByTestId } = render(<SeoConfig sdk={sdk} />);
      await wait();
      const contentTypeSelectField = queryByTestId('SeoConfig-select-contentType').getElementsByTagName('select')[0];
      
      expect(queryAllByTestId('SeoConfig-tablerow-contentType').length).toEqual(1);
      
      fireEvent.change(contentTypeSelectField, {
        target: {
          value: 'uiExtensionShowcase',
        }
      });
      await wait();
      expect(queryAllByTestId('SeoConfig-tablerow-contentType').length).toEqual(2);
    });
  });

  describe('content type table renderContentTypeConfigTable()', () => {
    test('should render empty state if no app config yet', async () => {
      _.set(
        sdk,
        'platformAlpha.app.getParameters',
        jest.fn().mockReturnValue({}),
      );
      const { queryByTestId } = render(<SeoConfig sdk={sdk} />);
      await wait();
      expect(queryByTestId('SeoConfig-table-contentType')).toBeFalsy();
    });
    test('should render correct header values', async () => {
      const { queryByTestId } = render(<SeoConfig sdk={sdk} />);
      await wait();
      expect(queryByTestId('SeoConfig-table-contentType')).toBeTruthy();
      const tableHeaderRow = queryByTestId('SeoConfig-tablehead-contentType');
      const tableContentTypeRow = queryByTestId('SeoConfig-tablerow-contentType');
      expect(tableHeaderRow).toBeTruthy();
      expect(tableHeaderRow.children.length)
        .toEqual(tableContentTypeRow.children.length);
    });

    test('should have the correct number of rows', async () => {
      _.set(
        sdk,
        'platformAlpha.app.getParameters',
        jest.fn().mockReturnValue({
          ...mockAppConfig,
          editorInterface: {
            seoApp: {
              controls: []
            },
            uiExtensionShowcase: {
              controls: []
            }
          }
        }),
      );
      const { queryAllByTestId } = render(<SeoConfig sdk={sdk} />);
      await wait();
      expect(queryAllByTestId('SeoConfig-tablerow-contentType').length)
        .toEqual(2);
    });
  });

  describe('content type table handleRemoveButton()', () => {
    test('should remove the row the user deleted', async () => {
      const { queryByTestId, queryAllByTestId } = render(<SeoConfig sdk={sdk} />);
      await wait();
      expect(queryAllByTestId('SeoConfig-tablerow-contentType').length).toBe(1);
      fireEvent.click(queryByTestId('SeoConfig-button-contentType-delete'));
      await wait();
      expect(queryAllByTestId('SeoConfig-tablerow-contentType').length).toBe(0);
      expect(1).toBe(1);
    });
  });

  describe('siteTitle input field', () => {
    test('value should change when user types', async () => {
      const { queryByTestId, getByTestId } = render(<SeoConfig sdk={sdk} />);
      await wait();
      expect(getByTestId('SeoConfig-siteName').value).toEqual(mockAppConfig.siteName);
      fireEvent.focus(queryByTestId('SeoConfig-siteName'));
      expect(getByTestId('SeoConfig-siteName').value).toEqual(mockAppConfig.siteName);
      await userEvent.type(getByTestId('SeoConfig-siteName'), 'testing');
      expect(getByTestId('SeoConfig-siteName').value).toEqual('testing');
    });
  });

  describe('onConfigure()', () => {
    const mockOnConfigure = jest.fn();
    SeoConfig.prototype.onConfigure = mockOnConfigure;
    // jest.mock('./SeoConfig', () => {
    //   return jest.fn().mockImplementation(()=> {
    //     return {
    //       onConfigure: mockOnConfigure,
    //     };
    //   });
    // });
    test('function is called with correct values', () => {

    });

    // SeoConfig.mockClear();
  });
});