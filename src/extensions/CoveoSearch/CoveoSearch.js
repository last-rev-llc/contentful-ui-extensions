/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "@contentful/forma-36-react-components/dist/styles.css";
import PropTypes from "prop-types";
import { locations } from "contentful-ui-extensions-sdk";
import CoveoSearchFieldDisplay from "./CoveoSearchFieldDisplay";
import CoveoSearchDialog from "./CoveoSearchDialog";

function CoveoSearch({ sdk }) {
  const { location } = sdk;

  if (location.is(locations.LOCATION_DIALOG)) {
    return <CoveoSearchDialog sdk={sdk} />;
  }

  return <CoveoSearchFieldDisplay sdk={sdk} />;
}

CoveoSearch.propTypes = {
  sdk: PropTypes.shape({
    location: PropTypes.string.isRequired
  }).isRequired,
  locations: PropTypes.shape({
    LOCATION_ENTRY_FIELD: PropTypes.string.isRequired,
    LOCATION_ENTRY_FIELD_SIDEBAR: PropTypes.string.isRequired,
    LOCATION_ENTRY_SIDEBAR: PropTypes.string.isRequired,
    LOCATION_DIALOG: PropTypes.string.isRequired,
    LOCATION_ENTRY_EDITOR: PropTypes.string.isRequired,
    LOCATION_PAGE: PropTypes.string.isRequired,
    LOCATION_APP_CONFIG: PropTypes.string.isRequired
  }).isRequired
};

export default CoveoSearch;
