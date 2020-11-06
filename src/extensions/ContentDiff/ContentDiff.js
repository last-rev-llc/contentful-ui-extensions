import React from 'react';
import PropTypes from 'prop-types';
import { locations } from 'contentful-ui-extensions-sdk';
import DiffSidebar from './ContentDiffSidebar';
import DiffDialog from './ContentDiffDialog';

const ContentDiff = ({ sdk }) => {
  return !sdk.location.is(locations.LOCATION_DIALOG) 
    ? (
      <>
        <DiffSidebar sdk={sdk} />
      </>
    ) 
    : (
      <>
        <DiffDialog sdk={sdk} />
      </>
    );

};

ContentDiff.propTypes = {
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

export default ContentDiff;