import React from 'react';
import _ from 'lodash';
import { render, cleanup, fireEvent } from '@testing-library/react';
import SeoConfig from './SeoConfig';

afterEach(() => {
  cleanup();
});

describe('<SeoConfig />', () => {
  describe('site title input field', () => {
    test.todo('');
  });

  describe('global default image', () => {
    test.todo('');
  });

  describe('content type dropdown', () => {
    test.todo('content types that are already selected should not show up in the dropdown');
  });

  describe('content type rows', () => {
    test.todo('');
  });

  describe('default fields for content type dropdown', () => {
    test.todo('');
  });
});