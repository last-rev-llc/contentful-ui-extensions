import React from "react";
import { render, cleanup, configure } from "@testing-library/react";
import RecipeIngredients from "./RecipeIngredients";
import defaultSdk, { mockSdkList } from "./mockSdk";

const renderComponent = (sdk = defaultSdk) =>
  render(<RecipeIngredients sdk={sdk} />);

configure({
  testIdAttribute: "data-test-id",
});

afterEach(() => {
  cleanup();
});

describe("RecipeIngredients helper methods", () => { });

describe("<RecipeIngredients />", () => {
  describe("IngredientDialog", () => {
    test("renders correctly", () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId("IngredientDialog")).toBeDefined();
    });
    test('Form renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('IngredientDialog-Form')).toBeDefined();
    });
    test('Step Label renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-label-step')).toBeDefined();
    });
    test('Step Input renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-text-input-step')).toBeDefined();
    });
    test('Ingredient Label renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-label-ingredient')).toBeDefined();
    });
    test('Ingredient Input renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-text-input-ingredient')).toBeDefined();
    });
    test('Imperial Quantity Label renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-label-imperialQuantity')).toBeDefined();
    });
    test('Imperial Quantity Input renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-text-input-imperialQuantity')).toBeDefined();
    });
    test('Imperial Measure Label renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-label-imperialMeasure')).toBeDefined();
    });
    test('Imperial Measure Input renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-select-imperialMeasure')).toBeDefined();
    });
    test('Metric Quantity Label renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-label-metricQuantity')).toBeDefined();
    });
    test('Metric Quantity Input renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-text-input-metricQuantity')).toBeDefined();
    });
    test('Metric Measure Label renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-label-metricMeasure')).toBeDefined();
    });
    test('Metric Measure Input renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-select-metricMeasure')).toBeDefined();
    });
    test('Button Save renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-button-Save')).toBeDefined();
    });
    test('Button Cancel renders correctly', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('cf-ui-button-Cancel')).toBeDefined();
    });
  });
  describe('IngredientList', () => {
    test('Table renders correctly', () => {
      const { getByTestId } = renderComponent(mockSdkList);
      expect(getByTestId('Ingredients-Table')).toBeDefined();
    });
    test('Table Row Step renders correctly', () => {
      const { getAllByTestId } = renderComponent(mockSdkList);
      expect(getAllByTestId('Ingredients-Table-Cell-Step').length).toBe(mockSdkList.field.getValue().ingredients.length);
    });
    test('Table Row Ingredient renders correctly', () => {
      const { getAllByTestId } = renderComponent(mockSdkList);
      expect(getAllByTestId('Ingredients-Table-Cell-Ingredient').length).toBe(mockSdkList.field.getValue().ingredients.length);
    });
    test('Table Row ImperialQuantity renders correctly', () => {
      const { getAllByTestId } = renderComponent(mockSdkList);
      expect(getAllByTestId('Ingredients-Table-Cell-ImperialQuantity').length).toBe(mockSdkList.field.getValue().ingredients.length);
    });
    test('Table Row MetricQuantity renders correctly', () => {
      const { getAllByTestId } = renderComponent(mockSdkList);
      expect(getAllByTestId('Ingredients-Table-Cell-MetricQuantity').length).toBe(mockSdkList.field.getValue().ingredients.length);
    });
    test('Table Row Actions renders correctly', () => {
      const { getAllByTestId } = renderComponent(mockSdkList);
      expect(getAllByTestId('Ingredients-Table-Cell-Actions').length).toBe(mockSdkList.field.getValue().ingredients.length);
    });
  });
});
