import React from 'react';
import PropTypes from 'prop-types';
import { locations } from 'contentful-ui-extensions-sdk';
import StepList from './StepList';
import './GenericTable.scss';
import { StepDialog } from './dialogs';

const GenericTable = ({ sdk }) => {
  return !sdk.location.is(locations.LOCATION_DIALOG) ? (
    <>
      <StepList sdk={sdk} />
    </>
  ) : (
    <>
      <StepDialog sdk={sdk} />
    </>
  );
};

GenericTable.propTypes = {
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

export default GenericTable;
