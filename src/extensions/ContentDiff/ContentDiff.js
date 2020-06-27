import React from 'react';
// import _ from 'lodash';
import PropTypes from 'prop-types';
import { locations } from 'contentful-ui-extensions-sdk';
import { SidebarExtension, DialogExtension } from './content-diff-dialog/index';

const ContentDiff = ({ sdk }) => {

  return !sdk.location.is(locations.LOCATION_DIALOG) 
    ? (
      <>
        <SidebarExtension sdk={sdk} />
      </>
    ) 
    : (
      <>
        <DialogExtension sdk={sdk} />
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