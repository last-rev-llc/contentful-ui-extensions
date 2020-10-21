/* eslint-disable react/prop-types */
// TODO: enable proptypes
import React, { useEffect, useState } from "react";
import { Button } from "@contentful/forma-36-react-components";
import "@contentful/forma-36-react-components/dist/styles.css";
import { get, has, isArray, pickBy } from "lodash";
import { TYPE_SAVED_SEARCH } from "../constants";

function CoveoSavedSearchFieldDisplay({ sdk }) {
  const {
    field,
    dialogs: { openExtension: openDialogExtension },
    parameters: {
      instance: { searchPageName }
    }
  } = sdk;

  const [fieldValue, setFieldValue] = useState(null);

  useEffect(() => {
    const detachValueChangeHandler = field.onValueChanged(setFieldValue);
    setFieldValue(field.getValue());

    return () => {
      detachValueChangeHandler(setFieldValue);
    };
  }, [field]);

  const openDialog = async () => {
    const data = await openDialogExtension({
      width: "fullWidth",
      title: "Last Rev Coveo Saved Search",
      allowHeightOverflow: true,
      parameters: {
        type: TYPE_SAVED_SEARCH,
        searchPageName,
        query: get(fieldValue, "query"),
        cq: get(fieldValue, "cq")
      }
    });
    if (has(data, "query")) {
      const pruned = pickBy(get(data, "query"), val => {
        if (!val) return false;
        if (isArray(val) && !val.length) return false;
        return true;
      });
      const cq = get(data, "cq");
      field.setValue({ query: pruned, cq });
    }
  };

  const removeSavedSearch = () => {
    field.setValue(null);
  };

  return (
    <>
      {fieldValue ? (
        <>
          <div>Saved search parameters:</div>
          <pre>{JSON.stringify(fieldValue, null, 2)}</pre>
        </>
      ) : (
        <div>No search saved.</div>
      )}

      <Button buttonType="primary" onClick={() => openDialog()}>
        {fieldValue ? "Edit the saved search" : "Generate a new search"}
      </Button>
      {fieldValue ? (
        <Button buttonType="primary" onClick={() => removeSavedSearch()}>
          Remove this saved search
        </Button>
      ) : null}
    </>
  );
}

export default CoveoSavedSearchFieldDisplay;
