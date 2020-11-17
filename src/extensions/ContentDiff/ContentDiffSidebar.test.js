/* eslint-disable react/no-danger */
// import React from 'react';
import { configure } from '@testing-library/react';

import { resetLookups } from './helpers';

configure({
  testIdAttribute: 'data-test-id'
});

afterEach(() => {
  resetLookups();
});

describe('<ContentDiffSidebar sdk={sdk} />', () => {
  describe('useEffect()', () => {
    test.todo('test initial load');
  });

  describe('refresh()', () => {
    test.todo('test refresh fireEvent');
  });

  describe('onButtonClick()', () => {
    test.todo('test onButtonClick fireEvent');
  });

  describe('getDropdownAndButton()', () => {
    test.todo('test getDropdownAndButton is rendered with correct information');
  });

  describe('getLoadedInfo()', () => {
    test.todo('test when versions length is <= 0');
    test.todo('test when versions length is > 0');
  });

  describe('getVersion()', () => {
    test.todo('test getVersion is fired when a version is selected');
  });

  describe('getOptions(options)', () => {
    test.todo('test getOptions to make sure correct information is rendered');
  });
});
