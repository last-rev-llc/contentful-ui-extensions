/* eslint-disable no-console */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Templates from './Templates';

const getReferenceFieldEntries = jest.fn();
const initContentfulExtension = jest.fn();
const mockTemplates = [
  {
    name: 'Blog Post',
    refs: [
      {
        byRef: '12345',
      },
      {
        new: 'sectionHero',
      },
      {
        new: 'sectionCards',
      },
    ],
  },
  {
    name: 'Customer Story',
    refs: [
      {
        byRef: 'sectionHero',
      },
      {
        new: '1234',
      },
      {
        new: '1234',
      },
    ],
  },
];

console.error = jest.fn();
console.warn = jest.fn();

afterEach(() => {
  cleanup();
  console.error.mockClear();
});


describe('<Templates />', () => {
  test('only shows select field if ref field is empty', () => {
    const { debug } = render(<Templates />);
    // expect(initContentfulExtension).toHaveBeenCalledTimes(1);
    debug();
  });
  test.todo('shows import information and button when template selected');
  test.todo('shows modal when create new template clicked');
  test.todo('only shows create new button when items exist in ref field');
  test.todo('modal displays the items with check boxes defaulting to "new entry" checked');
  test.todo('modal shows error when at least one import option per entry is not checked');
  test.todo('modal saves template creates JSON and adds it to user defined field');
});
