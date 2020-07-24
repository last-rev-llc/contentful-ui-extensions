import React from 'react';
import { render, cleanup, configure, fireEvent } from '@testing-library/react';
import RecipeSteps from './RecipeSteps';
import defaultSdk, { sdkList } from './mockSdk';

const renderComponent = (sdk = defaultSdk) =>
  render(<RecipeSteps sdk={sdk} />
  );

configure({
  testIdAttribute: 'data-test-id',
});

afterEach(() => {
  cleanup();
});

describe('RecipeSteps helper methods', () => {

});

describe('<RecipeSteps />', () => {
  describe('StepDialog', () => {
    test('renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('StepDialog')).toBeDefined();
    });
    test('Form renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('StepDialog-Form')).toBeDefined();
    });
    test('FormLabel Title renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('FormLabel-Title')).toBeDefined();
    });
    test('TextInput Title renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('TextInput-Title')).toBeDefined();
    });
    test('FormLabel Body renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('FormLabel-Body')).toBeDefined();
    });
    test('Textarea Body renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('Textarea-Body')).toBeDefined();
    });
    test('Button Save renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('Button-Save')).toBeDefined();
    });
    test('Button Cancel renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('Button-Cancel')).toBeDefined();
    });
    test('Button Save triggers correctly', () => {
      const { getByTestId } = renderComponent();
      fireEvent.click(getByTestId('Button-Save'));
    });
  });
  describe('StepList', () => {
    test('Table renders correctly', () => {
      const { getByTestId } = renderComponent(sdkList);
      expect(getByTestId('Steps-Table')).toBeDefined();
    });
    test('Table Row Title renders correctly', () => {
      const { getAllByTestId } = renderComponent(sdkList);
      expect(getAllByTestId('Steps-Table-Cell-Title').length).toBe(sdkList.field.getValue().length);
    });
    test('Table Row Body renders correctly', () => {
      const { getAllByTestId } = renderComponent(sdkList);
      expect(getAllByTestId('Steps-Table-Cell-Body').length).toBe(sdkList.field.getValue().length);
    });
    test('Table Row Actions renders correctly', () => {
      const { getAllByTestId } = renderComponent(sdkList);
      expect(getAllByTestId('Steps-Table-Cell-Actions').length).toBe(sdkList.field.getValue().length);
    });
    test('Icon Button renders correctly', () => {
      const { getByTestId } = renderComponent(sdkList);
      expect(getByTestId('IconButton-Click to add a new row')).toBeDefined();
    });
  });
});