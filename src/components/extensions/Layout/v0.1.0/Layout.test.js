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


describe('<Layout />', () => {
  test.todo('write tests');
});
