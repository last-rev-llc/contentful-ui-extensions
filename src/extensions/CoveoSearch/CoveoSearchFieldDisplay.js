/* eslint-disable react/prop-types */
import { get } from "lodash";
import React from "react";
import CoveoReferenceSearchFieldDisplay from "./CoveoReferenceSearch/CoveoReferenceSearchFieldDisplay";
import CoveoSavedSearchFieldDisplay from "./CoveoSavedSearch/CoveoSavedSearchFieldDisplay";

function CoveoSearchFieldDisplay({ sdk }) {
  const {
    field: { type, items }
  } = sdk;

  if (type === "Object") {
    return <CoveoSavedSearchFieldDisplay sdk={sdk} />;
  }

  if (type === "Array" && get(items, "linkType") === "Entry") {
    return <CoveoReferenceSearchFieldDisplay sdk={sdk} />;
  }

  return <div>This field type is not supported.</div>;
}

export default CoveoSearchFieldDisplay;
