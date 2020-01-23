import React from 'react';
// import _ from 'lodash';
import { render, cleanup } from '@testing-library/react';
import Seo from './Seo';

import sdk from './mockSdk';

afterEach(() => {
  cleanup();
});

describe('<Seo />', () => {
  describe('initialize with useEffect()', () => {
    test.todo('preview tab is selected by default');
    test.todo('seo object is in correct format');
  });

  describe('renderTabs()', () => {
    test('four tabs are present', () => {
      const { debug } = render(<Seo sdk={sdk}  />);
      // debug();
    });
    test.todo('general tab click should show general tab panel');
    test.todo('facebook tab click should show facebook tab panel');
    test.todo('twitter tab click should show twitter tab panel');
    test.todo('preview tab click should show preview tab panel');
  });

  describe('renderPreview()', () => {
    test.todo('pageTitle default should be siteName and pageTitelDelimiter');
    test.todo('pageTitle should equal the value of the');
    test.todo('onFieldChange triggerd by input onChange, onKeyPress, and onBlur');
  });

  describe('renderGeneralTab()', () => {
    test.todo('general tab content rendered correctly when general tab is clicked');
    test.todo('note warning that the content is not being indexed shown when robots value is noindex, nofollow');
    test.todo('onFieldChange triggerd by input onChange, onKeyPress, and onBlur');
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
  
  describe('renderFacebookTab()', () => {
    test.todo('facebook tab content rendered correctly when facebook tab is clicked');
    test.todo('onFieldChange triggerd by input onChange, onKeyPress, and onBlur');
    test.todo('onFieldChange triggerd by selecting image');
    test.todo('edit image udpates the og:image object with the new value and updates image card');
  });

  describe('renderTwitterTab()', () => {
    test.todo('content rendered correctly when twitter tab is clicked');
    test.todo('show copy from facebook button if facebook exists');
    test.todo('clicking copy from facebook updates the seoObject and displays post title and image card');
    test.todo('onFieldChange triggerd by input onChange, onKeyPress, and onBlur');
  });
});