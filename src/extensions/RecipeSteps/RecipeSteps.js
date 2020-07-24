import React from 'react';
import PropTypes from 'prop-types';
import { locations } from 'contentful-ui-extensions-sdk';
import StepList from './StepList';
import { StepDialog } from './dialogs/index';

const RecipeSteps = ({ sdk }) => {
  return !sdk.location.is(locations.LOCATION_DIALOG) 
    ? (
      <>
        <StepList sdk={sdk} />
      </>
    ) 
    : (
      <>
        <StepDialog sdk={sdk} />
      </>
    );

};

RecipeSteps.propTypes = {
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

export default RecipeSteps;