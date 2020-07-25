import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, FieldGroup } from '@contentful/forma-36-react-components';
import { withLabel, getTextInput, getSelect, getButton } from '../helpers/index';

const imperialUnits = ['Teaspoon','Teaspoons','Tablespoon','Tablespoons','Cup','Cups','Ounce','Ounces','Pound','Pounds','Gram','Grams','Pinch','Each','As needed','To serve','To Taste','Bunch','Bunches','Can','Cans','Clove','Cloves','Leaf','Leaves','Package','Packages','Recipe','Recipes','Rib','Ribs','Slice','Slices','Wedge','Wedges'];
const metricUnits = ['Milliliter','Milliliters','Liter','Liters','Ounce','Ounces','Gram','Grams','Pinch','Each','As needed','To serve','To Taste','Bunch','Bunches','Can','Cans','Clove','Cloves','Leaf','Leaves','Package','Packages','Recipe','Recipes','Rib','Ribs','Slice','Slices','Wedge','Wedges'];

const IngredientDialog = ({ sdk }) => {
  const [step, setStep] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [imperialMeasure, setImperialMeasure] = useState('');
  const [metricMeasure, setMetricMeasure] = useState('');
  const [imperialQuantity, setImperialQuantity] = useState('');
  const [metricQuantity, setMetricQuantity] = useState('');

  useEffect(() => {
    if (sdk.parameters.invocation.ingredient) {
      setStep(sdk.parameters.invocation.ingredient.step);
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
    sdk.close({ step: +step, ingredient, imperialMeasure, imperialQuantity: +imperialQuantity, metricMeasure, metricQuantity: +metricQuantity });
  };

  return (
    <div id='dialog-step-wrap'>
      <Form spacing="default">
        <FieldGroup>
          {withLabel('step', 'Step', () => getTextInput(step, (event) => setStep(event.currentTarget.value), { id: 'step', type: 'number', placeholder: 'Step' }))}
        </FieldGroup>
        <FieldGroup>
          {withLabel('ingredient', 'Ingredient', () => getTextInput(ingredient, (event) => setIngredient(event.currentTarget.value), { id: 'ingredient', placeholder: 'Ingredient' }))}
        </FieldGroup>
        <FieldGroup row>
          {withLabel('imperialQuantity', 'Imperial Quantity', () => getTextInput(imperialQuantity, (event) => setImperialQuantity(event.currentTarget.value), { id: 'imperialQuantity', type: 'number', placeholder: 'Imperial Quantity' }))}
          {withLabel('imperialMeasure', 'Imperial Measure', () => getSelect(imperialUnits, (event) => setImperialMeasure(event.currentTarget.value), { id: 'imperialMeasure' }))}
        </FieldGroup>
        <FieldGroup row>
          {withLabel('metricQuantity', 'Metric Quantity', () => getTextInput(metricQuantity, (event) => setMetricQuantity(event.currentTarget.value), { id: 'metricQuantity', type: 'number', placeholder: 'Metric Quantity' }))}
          {withLabel('metricMeasure', 'Metric Measure', () => getSelect(metricUnits, (event) => setMetricMeasure(event.currentTarget.value), { id: 'metricMeasure' }))}
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
          ingredient: PropTypes.string.isRequired,
        })
      }).isRequired
    }).isRequired
  }).isRequired
};

export default IngredientDialog;

