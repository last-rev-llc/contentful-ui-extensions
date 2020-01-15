import React from 'react';
// import _ from 'lodash';
import { render, cleanup } from '@testing-library/react';
import Seo from './Seo';

import sdk from './mockSdk';

afterEach(() => {
  cleanup();
});

describe('<Seo />', () => {
  test('shows one row with page title selected when there is no default value', () => {
    const { debug } = render(<Seo sdk={sdk}  />);
    debug();
    
  });

  test.todo('new dropdown added when user clicks the plus icon');
  test.todo('field is removed when user clicks the X icon');
  test.todo('shows input field when page title is selected');
  test.todo('shows radio field when page title is selected');
  test.todo('shows text area when description is selected');
  test.todo('shows ');
});