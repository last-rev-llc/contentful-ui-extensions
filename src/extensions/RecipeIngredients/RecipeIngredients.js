import React from 'react';
import PropTypes from 'prop-types';
import { locations } from 'contentful-ui-extensions-sdk';
import IngredientsList from './IngredientsList';
import './RecipeIngredients.scss';
import { IngredientDialog, BulkEditIngredients } from './dialogs';

const renderDialog = (sdk) => {
  const { dialogType } = sdk.parameters.invocation;
  switch (dialogType) {
    case 'bulk-edit':
      return <BulkEditIngredients sdk={sdk} />;
    default:
      return <IngredientDialog sdk={sdk} />;
  }
};
const RecipeIngredients = ({ sdk }) => {
  return !sdk.location.is(locations.LOCATION_DIALOG) ? (
    <>
      <IngredientsList sdk={sdk} />
    </>
  ) : (
    <>{renderDialog(sdk)}</>
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
