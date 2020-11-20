import React from 'react';
import { render, cleanup, configure, fireEvent } from '@testing-library/react';
import GenericTable from './GenericTable';
import defaultSdk, { sdkList } from './mockSdk';

const renderComponent = (sdk = defaultSdk) => render(<GenericTable sdk={sdk} />);

configure({
  testIdAttribute: 'data-testid'
});

afterEach(() => {
  cleanup();
});

describe('GenericTable helper methods', () => {});

describe('<GenericTable />', () => {
  describe('StepDialog', () => {
    test('renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('StepDialog')).toBeDefined();
    });
    test('Form renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('StepDialog-Form')).toBeDefined();
    });
    test('Step Number Field renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-text-field-stepNumber')).toBeDefined();
    });
    test('Title Field renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-text-field-title')).toBeDefined();
    });
    test('Label Body renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-label-Body')).toBeDefined();
    });
    test.only('Textarea Body renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-body-Body')).toBeDefined();
    });
    test('Button Save renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-button-Save')).toBeDefined();
    });
    test('Button Cancel renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-button-Cancel')).toBeDefined();
    });
    test('Button Save triggers correctly', () => {
      const { getByTestId } = renderComponent();
      fireEvent.click(getByTestId('cf-ui-button-Save'));
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
      expect(getByTestId('cf-ui-button-Click to add a new row')).toBeDefined();
    });
  });
});
