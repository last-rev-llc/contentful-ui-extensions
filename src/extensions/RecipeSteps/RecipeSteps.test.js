import React from 'react';
import _ from 'lodash';
import { render, cleanup, configure, fireEvent } from '@testing-library/react';

import sdk from './mockSdk';

configure({
  testIdAttribute: 'data-test-id',
});

afterEach(() => {
  cleanup();
});

describe('RecipeSteps helper methods', () => {
  
});

describe('<RecipeSteps />', () => {
  describe('initialize with useEffect()', () => {
    
  });
});