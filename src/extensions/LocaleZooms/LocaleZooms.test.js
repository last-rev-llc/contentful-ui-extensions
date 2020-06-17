import React from 'react';
import _ from 'lodash';
import { render, cleanup, configure, fireEvent } from '@testing-library/react';
import LocaleZooms from './LocaleZooms';

import sdk from './mockSdk';

configure({
  testIdAttribute: 'data-test-id',
});

afterEach(() => {
  cleanup();
});

describe('LocaleZooms helper methods', () => {
  test.todo('describe helper methods');
});

describe('<LocaleZooms />', () => {
  test.todo('describe LocaleZooms');
});