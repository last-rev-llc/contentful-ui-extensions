import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, FieldGroup } from '@contentful/forma-36-react-components';
import { withLabel, getTextInput, getSelect } from '../helpers';
import { getButton, getTextField } from '../../../shared/helpers';

const imperialUnits = [
  'Teaspoon',
  'Teaspoons',
  'Tablespoon',
  'Tablespoons',
  'Cup',
  'Cups',
  'Ounce',
  'Ounces',
  'Pound',
  'Pounds',
  'Gram',
  'Grams',
  'Pinch',
  'Each',
  'As needed',
  'To serve',
  'To Taste',
  'Bunch',
  'Bunches',
  'Can',
  'Cans',
  'Clove',
  'Cloves',
  'Leaf',
  'Leaves',
  'Package',
  'Packages',
  'Recipe',
  'Recipes',
  'Rib',
  'Ribs',
  'Slice',
  'Slices',
  'Sprig',
  'Sprigs',
  'Wedge',
  'Wedges',
  'Head',
  'Heads'
].sort();

const metricUnits = [
  'Teaspoon',
  'Teaspoons',
  'Tablespoon',
  'Tablespoons',
  'Milliliter',
  'Milliliters',
  'Liter',
  'Liters',
  'Ounce',
  'Ounces',
  'Gram',
  'Grams',
  'Pinch',
  'Each',
  'As needed',
  'To serve',
  'To Taste',
  'Bunch',
  'Bunches',
  'Can',
  'Cans',
  'Clove',
  'Cloves',
  'Leaf',
  'Leaves',
  'Package',
  'Packages',
  'Recipe',
  'Recipes',
  'Rib',
  'Ribs',
  'Slice',
  'Slices',
  'Sprig',
  'Sprigs',
  'Wedge',
  'Wedges',
  'Head',
  'Heads'
].sort();

const IngredientDialog = ({ sdk }) => {
  const [step, setStep] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [imperialMeasure, setImperialMeasure] = useState(imperialUnits[0]);
  const [metricMeasure, setMetricMeasure] = useState(metricUnits[0]);
  const [imperialQuantity, setImperialQuantity] = useState('');
  const [metricQuantity, setMetricQuantity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (sdk.parameters.invocation.ingredient) {
      setStep(sdk.parameters.invocation.ingredient.step === '' ? null : sdk.parameters.invocation.ingredient.step);
      setIngredient(sdk.parameters.invocation.ingredient.ingredient);
      setImperialMeasure(sdk.parameters.invocation.ingredient.imperialMeasure);
      setImperialQuantity(sdk.parameters.invocation.ingredient.imperialQuantity);
      setMetricMeasure(sdk.parameters.invocation.ingredient.metricMeasure);
      setMetricQuantity(sdk.parameters.invocation.ingredient.metricQuantity);
    }
  }, [sdk]);

  const closeDialog = () => {
    sdk.close();
  };

  const saveStep = () => {
    const returned = {
      step: step ? +step : '',
      imperialQuantity: imperialQuantity ? +imperialQuantity : '',
      metricQuantity: metricQuantity ? +metricQuantity : '',
      imperialMeasure: imperialQuantity ? imperialMeasure : '',
      metricMeasure: metricQuantity ? metricMeasure : ''
    };
    if (ingredient) {
      sdk.close({
        step: returned.step,
        ingredient,
        imperialMeasure: returned.imperialMeasure,
        imperialQuantity: returned.imperialQuantity,
        metricMeasure: returned.metricMeasure,
        metricQuantity: returned.metricQuantity
      });
    } else {
      setErrorMessage('The Ingredient field is required');
    }
  };

  const stepInput = () =>
    getTextInput(step, (event) => setStep(event.currentTarget.value), {
      id: 'stepNumber',
      type: 'number',
      placeholder: 'Step Number'
    });

  const ingredientInput = () =>
    getTextField(ingredient, (event) => setIngredient(event.currentTarget.value), errorMessage, {
      id: 'ingredient',
      labelText: 'Ingredient',
      required: true
    });

  const imperialQuantityInput = () =>
    getTextInput(imperialQuantity, (event) => setImperialQuantity(event.currentTarget.value), {
      id: 'imperialQuantity',
      type: 'number',
      placeholder: 'Imperial Quantity'
    });

  const imperialMeasureSelect = () =>
    getSelect(
      imperialUnits,
      (event) => setImperialMeasure(event.currentTarget.value),
      { id: 'imperialMeasure' },
      imperialMeasure
    );

  const metricQuantityInput = () =>
    getTextInput(metricQuantity, (event) => setMetricQuantity(event.currentTarget.value), {
      id: 'metricQuantity',
      type: 'number',
      placeholder: 'Metric Quantity'
    });

  const metricMeasureSelect = () =>
    getSelect(
      metricUnits,
      (event) => setMetricMeasure(event.currentTarget.value),
      { id: 'metricMeasure' },
      metricMeasure
    );

  return (
    <div id="dialog-step-wrap" data-testid="IngredientDialog">
      <Form spacing="default" data-testid="IngredientDialog-Form">
        <FieldGroup>{withLabel('stepNumber', 'Step Number', stepInput)}</FieldGroup>
        <FieldGroup>{ingredientInput()}</FieldGroup>
        <FieldGroup row>
          {withLabel('imperialQuantity', 'Imperial Quantity', imperialQuantityInput)}
          {withLabel('imperialMeasure', 'Imperial Measure', imperialMeasureSelect)}
        </FieldGroup>
        <FieldGroup row>
          {withLabel('metricQuantity', 'Metric Quantity', metricQuantityInput)}
          {withLabel('metricMeasure', 'Metric Measure', metricMeasureSelect)}
        </FieldGroup>
        <FieldGroup row>
          {getButton('Save', 'positive', saveStep)}
          {getButton('Cancel', 'muted', closeDialog)}
        </FieldGroup>
      </Form>
    </div>
  );
};

IngredientDialog.propTypes = {
  sdk: PropTypes.shape({
    close: PropTypes.func.isRequired,
    parameters: PropTypes.shape({
      invocation: PropTypes.shape({
        ingredient: PropTypes.shape({
          imperialQuantity: PropTypes.string.isRequired,
          imperialMeasure: PropTypes.string.isRequired,
          metricQuantity: PropTypes.string.isRequired,
          metricMeasure: PropTypes.string.isRequired,
          step: PropTypes.string.isRequired,
          ingredient: PropTypes.string.isRequired
        })
      }).isRequired
    }).isRequired
  }).isRequired
};

export default IngredientDialog;
