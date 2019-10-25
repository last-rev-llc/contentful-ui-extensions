/* eslint-disable no-console */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';


console.error = jest.fn();
console.warn = jest.fn();

afterEach(() => {
  cleanup();
  console.error.mockClear();
});


describe('<Colors />', () => {
  test.todo('fails correctly if field value is not valid color hex');
  test.todo('color buttons display correctly based on validations');
  test.todo('nothing selected if field does not have value');
  test.todo('correct button selected based on field value');
  test.todo('changes filed value on click');
});
