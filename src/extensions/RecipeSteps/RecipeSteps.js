import React from 'react';
import PropTypes from 'prop-types';
import { locations } from 'contentful-ui-extensions-sdk';
import StepList from './StepList';
import './RecipeSteps.scss';
import { StepDialog, BulkEditSteps } from './dialogs';

const renderDialog = (sdk) => {
  const { dialogType } = sdk.parameters.invocation;
  switch (dialogType) {
    case 'bulk-edit':
      return <BulkEditSteps sdk={sdk} />;
    default:
      return <StepDialog sdk={sdk} />;
  }
};

const RecipeSteps = ({ sdk }) => {
  return !sdk.location.is(locations.LOCATION_DIALOG) ? (
    <>
      <StepList sdk={sdk} />
    </>
  ) : (
    <>{renderDialog(sdk)}</>
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
