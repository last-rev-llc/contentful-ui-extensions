import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { locations } from "contentful-ui-extensions-sdk";
import MainContent from "./MainContent";
import SDKPropTypes from "./SDKPropTypes";

export const TableBuilderPropTypes = {
  sdk: PropTypes.shape(SDKPropTypes).isRequired,
};

const TableBuilder = ({ sdk }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (sdk.location.is(locations.LOCATION_DIALOG)) setIsDialogOpen(true);
    else setIsDialogOpen(false);
  }, [sdk.location]);

  if (isDialogOpen) return <div>dialog content</div>;

  return <MainContent sdk={sdk} />;
};

TableBuilder.propTypes = TableBuilderPropTypes;

export default TableBuilder;
