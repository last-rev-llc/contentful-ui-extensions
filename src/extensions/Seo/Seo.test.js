import React from 'react';
import _ from 'lodash';
import { render, cleanup, configure, fireEvent, wait } from '@testing-library/react';
import Seo from './Seo';

import mockContentfulSdk from '../../__mocks__/mockContentfulSdk';
import mockContentfulAsset from '../../__mocks__/mockContentfulAsset';
import mockFieldValue from './__mocks__/mockFieldValue';

let sdk;

configure({
  testIdAttribute: 'data-test-id',
});

beforeEach(() => {
  sdk = mockContentfulSdk.init(mockFieldValue);
});

afterEach(() => {
  cleanup();
});

describe('<Seo />', () => {
  describe('initialize with useEffect()', () => {
    test('preview tab is selected by default', () => {
      const { getByTestId } = render(<Seo sdk={sdk} />);
      expect(getByTestId('Seo-tab-preview').getAttribute('aria-selected'))
        .toBe('true');
      expect(sdk.field.getValue).toHaveBeenCalled();
    });
    test.todo('shows error note if seo object is not in correct format');
  });

  describe('renderTabs()', () => {
    test('four tabs are present', () => {
      const { getByTestId } = render(<Seo sdk={sdk}  />);
      expect(getByTestId('Seo-tabs').children.length)
        .toBe(4);
    });
    test('general tab click should show general tab panel', () => {
      const { queryByTestId, getByTestId } = render(<Seo sdk={sdk}  />);
      fireEvent.click(getByTestId('Seo-tab-general'));
      expect(queryByTestId('Seo-tabpanel-preview')).toBeNull();
      expect(queryByTestId('Seo-tabpanel-general')).toBeTruthy();
    });
    test('facebook tab click should show facebook tab panel', async () => {
      const { queryByTestId, getByTestId } = render(<Seo sdk={sdk}  />);
      fireEvent.click(getByTestId('Seo-tab-facebook'));
      await wait();
      expect(queryByTestId('Seo-tabpanel-preview')).toBeNull();
      expect(queryByTestId('Seo-tabpanel-facebook')).toBeTruthy();
    });
    test('twitter tab click should show twitter tab panel', async () => {
      const { queryByTestId, getByTestId } = render(<Seo sdk={sdk}  />);
      fireEvent.click(getByTestId('Seo-tab-twitter'));
      await wait();
      expect(queryByTestId('Seo-tabpanel-preview')).toBeNull();
      expect(queryByTestId('Seo-tabpanel-twitter')).toBeTruthy();
    });
    test('preview tab click should show preview tab panel', async () => {
      const { queryByTestId, getByTestId } = render(<Seo sdk={sdk}  />);
      fireEvent.click(getByTestId('Seo-tab-facebook'));
      await wait();
      expect(queryByTestId('Seo-tabpanel-preview')).toBeNull();
      expect(queryByTestId('Seo-tabpanel-facebook')).toBeTruthy();
      fireEvent.click(getByTestId('Seo-tab-preview'));
      expect(queryByTestId('Seo-tabpanel-facebook')).toBeNull();
      expect(queryByTestId('Seo-tabpanel-preview')).toBeTruthy();
    });
  });

  describe('renderPreview()', () => {
    test('default text is shown when no seo object is present', () => {
      const { getByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({})
        }
      }} />);
      expect(getByTestId('Seo-tabpanel-preview-title').textContent)
        .toBe('Please enter a page title');
      expect(getByTestId('Seo-tabpanel-preview-description').textContent)
        .toBe('Please enter a meta description that is between 100 and 250 characters long');
    });
    test('pageTitle should equal the value of the title property', () =>{
      const { getByTestId } = render(<Seo sdk={sdk} />);
      expect(getByTestId('Seo-tabpanel-preview-title').textContent)
        .toBe(sdk.field.getValue().title.value);
    });
    test('description equals the value of description property', () => {
      const { getByTestId } = render(<Seo sdk={sdk} />);
      expect(getByTestId('Seo-tabpanel-preview-description').textContent)
        .toBe(sdk.field.getValue().description.value);
    });

    test.todo('cite should equal ??');
  });

  describe('renderGeneralTab()', () => {
    test('input field values default to object property values', () => {
      const { getByTestId } = render(<Seo sdk={sdk} />);
      fireEvent.click(getByTestId('Seo-tab-general'));
      expect(getByTestId('Seo-tabpanel-general-title').value)
        .toBe(sdk.field.getValue().title.value);
      expect(getByTestId('Seo-tabpanel-general-description').value)
        .toBe(sdk.field.getValue().description.value);
      expect(getByTestId('Seo-tabpanel-general-keywords').value)
        .toBe(sdk.field.getValue().keywords.value);
      expect(getByTestId('Seo-tabpanel-general-robots-true').checked)
        .toBeTruthy();

    });

    test('note warning that the content is not being indexed shown when robots value is noindex, nofollow', () => {
      const { getByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({
            robots: {
              name: 'robots',
              value: 'noindex,nofollow',
            }
          })
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-general'));
      expect(getByTestId('Seo-tabpanel-general-robots-false').checked)
        .toBeTruthy();
    });
    test('onFieldChange triggerd by input onKeyPress, and onBlur', async () => {
      const { getByTestId } = render(<Seo sdk={sdk} />);
      fireEvent.click(getByTestId('Seo-tab-general'));

      fireEvent.blur(getByTestId('Seo-tabpanel-general-title'));
      fireEvent.focus(getByTestId('Seo-tabpanel-general-title'));
      await wait();
      expect(await sdk.field.setValue).toHaveBeenCalledTimes(1);

      fireEvent.blur(getByTestId('Seo-tabpanel-general-description'));
      fireEvent.focus(getByTestId('Seo-tabpanel-general-description'));
      fireEvent.change(getByTestId('Seo-tabpanel-general-description'), {
        target: {
          value: 'ABC'
        }
      });
      await wait();
      expect(await sdk.field.setValue).toHaveBeenCalledTimes(2);
      fireEvent.blur(getByTestId('Seo-tabpanel-general-keywords'));
      fireEvent.focus(getByTestId('Seo-tabpanel-general-keywords'));
      fireEvent.change(getByTestId('Seo-tabpanel-general-keywords'), {
        target: {
          value: 'ABC'
        }
      });
      await wait();
      expect(await sdk.field.setValue).toHaveBeenCalledTimes(3);
    });
  });

  describe('renderFacebookTab()', () => {
    test('fields should default to values in the seo object', async () => {
      const { getByTestId } = render(<Seo sdk={sdk} />);
      fireEvent.click(getByTestId('Seo-tab-facebook'));
      await wait();
      expect(getByTestId('Seo-tabpanel-og:title').value)
        .toBe(sdk.field.getValue()['og:title'].value);
      expect(getByTestId('Seo-tabpanel-og:description').value)
        .toBe(sdk.field.getValue()['og:description'].value);
    });

    test('asset card shown when value for og:image is valid url', async () => {
      const { getByTestId, queryByTestId } = render(<Seo sdk={sdk} />);
      fireEvent.click(getByTestId('Seo-tab-facebook'));
      await wait();
      expect(getByTestId('SingleAssetWithButton-AssetCard'))
        .toBeTruthy();
      expect(getByTestId('SingleAssetWithButton-AssetCard').getElementsByTagName('img')[0].getAttribute('src'))
        .toBe(_.get(mockContentfulAsset.success, `fields.file.${sdk.field.locale}.url`));
      expect(queryByTestId('SingleAssetWithButton-Button'))
        .toBeNull();
    });

    test('should default to button if no value for og:image is present', async () => {
      const { getByTestId, queryByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({})
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-facebook'));
      await wait();
      expect(queryByTestId('SingleAssetWithButton-AssetCard'))
        .toBeNull();
      expect(queryByTestId('SingleAssetWithButton-Button'))
        .toBeTruthy();
    });
  });

  describe('renderTwitterTab()', () => {
    test.todo('should render twitter fields defaults if no values for twitter fields');
    test('should render twitter field values if present', async () => {
      const { getByTestId } = render(<Seo sdk={sdk} />);
      fireEvent.click(getByTestId('Seo-tab-twitter'));
      await wait();
      expect(getByTestId('Seo-tabpanel-twitter:title').value)
        .toBe(sdk.field.getValue()['twitter:title'].value);
      expect(getByTestId('Seo-tabpanel-twitter:description').value)
        .toBe(sdk.field.getValue()['twitter:description'].value);
    });

    test('asset card shown when value for twitter:image is valid url', async () => {
      const { getByTestId, queryByTestId } = render(<Seo sdk={sdk} />);
      fireEvent.click(getByTestId('Seo-tab-twitter'));
      await wait();
      expect(getByTestId('SingleAssetWithButton-AssetCard'))
        .toBeTruthy();
      expect(getByTestId('SingleAssetWithButton-AssetCard').getElementsByTagName('img')[0].getAttribute('src'))
        .toBe(_.get(mockContentfulAsset.success, `fields.file.${sdk.field.locale}.url`));
      expect(queryByTestId('SingleAssetWithButton-Button'))
        .toBeNull();
    });

    test('button to select image is shown when no value for og:image', () => {
      const { getByTestId, queryByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({})
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-twitter'));
      expect(queryByTestId('SingleAssetWithButton-AssetCard'))
        .toBeNull();
      expect(queryByTestId('SingleAssetWithButton-Button'))
        .toBeTruthy();
    });
  });  
});