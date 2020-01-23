import React from 'react';
import _ from 'lodash';
import { render, cleanup, fireEvent } from '@testing-library/react';
import SeoConfig from './SeoConfig';

afterEach(() => {
  cleanup();
});

describe('<SeoConfig />', () => {
  describe('initialize with componentDidMount()', () => {
    test.todo('');
  });

  describe('renderContentTypeDropdown()', () => {
    test.todo('content types that are already selected should not show up in the dropdown');
    test.todo('');
  });

  describe('renderDefaultFieldConfig()', () => {
    test.todo('');
  });

  describe('renderContentTypeConfigRow()', () => {
  });

  describe('renderContentTypeConfigTable()', () => {
    test.todo('');
  });

  describe('handleRemoveButton()', () => {
    test.todo('');
  });

  describe('handleDefaultFieldChange()', () => {
    test.todo('');
  });
  describe('handleContentTypeFieldChange()', () => {
    test.todo('');
  });
});