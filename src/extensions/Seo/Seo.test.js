import React from 'react';
// import _ from 'lodash';
import { render, cleanup } from '@testing-library/react';
import Seo from './Seo';

import sdk from './mockSdk';

afterEach(() => {
  cleanup();
});

describe('<Seo />', () => {
  test('dropdown populated correctly from the metaDataOptions object', () => {
    const { debug } = render(<Seo sdk={sdk}  />);
    debug();
    
  });
});