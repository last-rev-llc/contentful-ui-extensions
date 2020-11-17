import React from 'react';
import PropTypes from 'prop-types';
import { locations } from 'contentful-ui-extensions-sdk';
import IngredientsList from './IngredientsList';
import './RecipeIngredients.scss';
import { IngredientDialog } from './dialogs';

const RecipeIngredients = ({ sdk }) => {
  return !sdk.location.is(locations.LOCATION_DIALOG) ? (
    <>
      <IngredientsList sdk={sdk} />
    </>
  ) : (
    <>
      <IngredientDialog sdk={sdk} />
    </>
  );
};

RecipeIngredients.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
    location: PropTypes.shape({
      is: PropTypes.func.isRequired
    })
  }).isRequired
};

export default RecipeIngredients;
