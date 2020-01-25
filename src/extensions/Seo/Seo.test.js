import React from 'react';
import { omit } from 'lodash';
import { render, cleanup, configure, fireEvent, act } from '@testing-library/react';
import Seo from './Seo';

import sdk from './mockSdk';

configure({
  testIdAttribute: 'data-test-id',
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
    test('facebook tab click should show facebook tab panel', () => {
      const { queryByTestId, getByTestId } = render(<Seo sdk={sdk}  />);
      fireEvent.click(getByTestId('Seo-tab-facebook'));
      expect(queryByTestId('Seo-tabpanel-preview')).toBeNull();
      expect(queryByTestId('Seo-tabpanel-facebook')).toBeTruthy();
    });
    test('twitter tab click should show twitter tab panel', () => {
      const { queryByTestId, getByTestId } = render(<Seo sdk={sdk}  />);
      fireEvent.click(getByTestId('Seo-tab-twitter'));
      expect(queryByTestId('Seo-tabpanel-preview')).toBeNull();
      expect(queryByTestId('Seo-tabpanel-twitter')).toBeTruthy();
    });
    test('preview tab click should show preview tab panel', () => {
      const { queryByTestId, getByTestId } = render(<Seo sdk={sdk}  />);
      fireEvent.click(getByTestId('Seo-tab-facebook'));
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
    test('input title value is same as seo object title property value', () => {
      const { getByTestId } = render(<Seo sdk={sdk} />);
      fireEvent.click(getByTestId('Seo-tab-general'));
      expect(getByTestId('Seo-tabpanel-general-title').getElementsByTagName('input')[0].value)
        .toBe(sdk.field.getValue().title.value);

    });
    test('textarea description value is same as seo object description property value', () => {
      const { getByTestId } = render(<Seo sdk={sdk} />);
      fireEvent.click(getByTestId('Seo-tab-general'));
      expect(getByTestId('Seo-tabpanel-general-description').getElementsByTagName('textarea')[0].value)
        .toBe(sdk.field.getValue().description.value);
    });

    test('input keywords value is the same as seo object keywords property value', () => {
      const { getByTestId } = render(<Seo sdk={sdk} />);
      fireEvent.click(getByTestId('Seo-tab-general'));
      expect(getByTestId('Seo-tabpanel-general-keywords').getElementsByTagName('input')[0].value)
        .toBe(sdk.field.getValue().keywords.value);
    });

    test('radio robots default selection is yes', () => {
      const { getByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({})
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-general'));
      expect(getByTestId('Seo-tabpanel-general-noindex-true').getElementsByTagName('input')[0].checked)
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
      expect(getByTestId('Seo-tabpanel-general-noindex-false').getElementsByTagName('input')[0].checked)
        .toBeTruthy();
    });
    test.todo('onFieldChange triggerd by input onChange, onKeyPress, and onBlur');
  });

  describe('renderFacebookTab()', () => {
    test('og:title field defaults to title field', () => {
      const { getByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({
            title: {
              name: 'title',
              value: 'thisisatest'
            }
          })
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-facebook'));
      expect(getByTestId('Seo-tabpanel-og:title').getElementsByTagName('input')[0].value)
        .toBe('thisisatest');
    });

    test('og:title input field value is same as seo object og:title property', () => {
      const { getByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({
            title: {
              name: 'title',
              value: 'thisisatest'
            },
            'og:title': {
              name: 'og:title',
              value: 'thisisatestofog:title'
            }
          })
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-facebook'));
      expect(getByTestId('Seo-tabpanel-og:title').getElementsByTagName('input')[0].value)
        .toBe('thisisatestofog:title');
    });

    test('og:description field defaults to description field', () => {
      const { getByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({
            description: {
              name: 'description',
              value: 'thisisatest'
            }
          })
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-facebook'));
      expect(getByTestId('Seo-tabpanel-og:description').getElementsByTagName('textarea')[0].value)
        .toBe('thisisatest');
    });

    test('og:description textarea field value is same as seo object og:description property', () => {
      const { getByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({
            description: {
              name: 'description',
              value: 'thisisatest'
            },
            'og:description': {
              name: 'og:description',
              value: 'thisisatestofog:description'
            }
          })
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-facebook'));
      expect(getByTestId('Seo-tabpanel-og:description').getElementsByTagName('textarea')[0].value)
        .toBe('thisisatestofog:description');
    });

    test.todo('asset card shown when value for og:image is valid url');
    test.todo('button to select image is shown when no value for og:image');

    // test('asset card shown when value for og:image is valid url', () => {
    //   sdk.space.getAsset = jest.fn().mockResolvedValueOnce({});
    //   const { debug, getByTestId, queryByTestId } = render(<Seo sdk={{
    //     ...sdk,
    //     field: {
    //       ...sdk.field,
    //       getValue: jest.fn().mockResolvedValueOnce({
    //         'og:image': {
    //           name: 'og:image',
    //           value: {
    //             id: '1234asdf',
    //             title: 'test',
    //             url: '//test.com/sample.jpg',
    //           }
    //         }
    //       })
    //     }
    //   }} />);
    //   fireEvent.click(getByTestId('Seo-tab-facebook'));
    //   expect(sdk.space.getAsset).toHaveBeenCalledTimes(1);
    //   // expect(getByTestId('SingleAssetWithButton-AssetCard'))
    //   //   .toBeTruthy();
    //   // expect(getByTestId('SingleAssetWithButton-AssetCard').getElementsByTagName('img')[0].getAttribute('src'))
    //   //   .toBe('//test.com/sample.jpg');
    //   // expect(queryByTestId('SingleAssetWithButton-Button'))
    //   //   .toBeNull();
    // });

    // test('button to select image is shown when no value for og:image', () => {
    //   const { getByTestId, queryByTestId } = render(<Seo sdk={{
    //     ...sdk,
    //     field: {
    //       ...sdk.field,
    //       getValue: jest.fn().mockReturnValue({})
    //     }
    //   }} />);
    //   fireEvent.click(getByTestId('Seo-tab-facebook'));
    //   // expect(queryByTestId('SingleAssetWithButton-AssetCard'))
    //   //   .toBeNull();
    //   // expect(queryByTestId('SingleAssetWithButton-Button'))
    //   //   .toBeTruthy();
    // });
  });

  describe('renderTwitterTab()', () => {
    test('twitter:title field defaults to title field', () => {
      const { getByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({
            title: {
              name: 'title',
              value: 'thisisatest'
            }
          })
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-twitter'));
      expect(getByTestId('Seo-tabpanel-twitter:title').getElementsByTagName('input')[0].value)
        .toBe('thisisatest');
    });

    test('twitter:title input field value is same as seo object og:title property', () => {
      const { getByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({
            title: {
              name: 'title',
              value: 'thisisatest'
            },
            'twitter:title': {
              name: 'twitter:title',
              value: 'thisisatestoftwitter:title'
            }
          })
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-twitter'));
      expect(getByTestId('Seo-tabpanel-twitter:title').getElementsByTagName('input')[0].value)
        .toBe('thisisatestoftwitter:title');
    });

    test('twitter:description field defaults to description field', () => {
      const { getByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({
            description: {
              name: 'description',
              value: 'thisisatest'
            }
          })
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-twitter'));
      expect(getByTestId('Seo-tabpanel-twitter:description').getElementsByTagName('textarea')[0].value)
        .toBe('thisisatest');
    });

    test('twitter:description textarea field value is same as seo object og:description property', () => {
      const { getByTestId } = render(<Seo sdk={{
        ...sdk,
        field: {
          ...sdk.field,
          getValue: jest.fn().mockReturnValue({
            description: {
              name: 'description',
              value: 'thisisatest'
            },
            'twitter:description': {
              name: 'twitter:description',
              value: 'thisisatestoftwitter:description'
            }
          })
        }
      }} />);
      fireEvent.click(getByTestId('Seo-tab-twitter'));
      expect(getByTestId('Seo-tabpanel-twitter:description').getElementsByTagName('textarea')[0].value)
        .toBe('thisisatestoftwitter:description');
    });

    // test('asset card shown when value for twitter:image is valid url', () => {
    //   const { getByTestId, queryByTestId } = render(<Seo sdk={{
    //     ...sdk,
    //     field: {
    //       ...sdk.field,
    //       getValue: jest.fn().mockReturnValue({
    //         'twitter:image': {
    //           name: 'twitter:image',
    //           value: {
    //             title: 'test',
    //             url: '//test.com/sample.jpg',
    //           }
    //         }
    //       })
    //     }
    //   }} />);
    //   fireEvent.click(getByTestId('Seo-tab-twitter'));
    //   expect(getByTestId('Seo-socialImage-assetCard'))
    //     .toBeTruthy();
    //   expect(getByTestId('Seo-socialImage-assetCard').getElementsByTagName('img')[0].getAttribute('src'))
    //     .toBe('//test.com/sample.jpg');
    //   expect(queryByTestId('SingleAssetWithButton-Button'))
    //     .toBeNull();
    // });

    // test('button to select image is shown when no value for og:image', () => {
    //   const { getByTestId, queryByTestId } = render(<Seo sdk={{
    //     ...sdk,
    //     field: {
    //       ...sdk.field,
    //       getValue: jest.fn().mockReturnValue({})
    //     }
    //   }} />);
    //   fireEvent.click(getByTestId('Seo-tab-twitter'));
    //   expect(queryByTestId('Seo-socialImage-assetCard'))
    //     .toBeNull();
    //   expect(queryByTestId('SingleAssetWithButton-Button'))
    //     .toBeTruthy();
    // });
  });

  describe('handleAssetSelection()', () => {
    test.todo('button shown when no value for og:image');
    test.todo('image card shown when there is a valid value object for og:image');
    test.todo('image card shows correct status');
    test.todo('remove image removes the og:image item from the seo object and shows the button');
  });

  describe('renderSocialImage()', () => {
    test.todo('');
  });
  
  
});