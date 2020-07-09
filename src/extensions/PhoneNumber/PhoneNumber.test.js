import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import PhoneNumber from './PhoneNumber';

import sdk from './mockSdk';

afterEach(() => {
  cleanup();
});

describe('<PhoneNumber />', () => {
  // Ensure the component fails correctly
  test.todo('shows error message when sdk not present');


  // Doesn't do anything.  Need a quick tutorial on how these tests are supposed to work.
  test('Getting a container.  Needs to do something with this', () => {
    const { container } = render(<PhoneNumber sdk={sdk} />);
    // console.log(container);
    // expect(container.firstChild.querySelectorAll('.active').length)
    //   .toBe(1);
    // expect(container.firstChild.querySelector('.active').getAttribute('data-hex'))
    //   .toEqual(sdk.field.getValue());
  });

});
