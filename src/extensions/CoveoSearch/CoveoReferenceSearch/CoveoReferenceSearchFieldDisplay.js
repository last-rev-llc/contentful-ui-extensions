/* eslint-disable react/prop-types */
// TODO: enable proptypes
import React, { useCallback, useEffect, useState } from "react";
import { EntityList, Button } from "@contentful/forma-36-react-components";
import "@contentful/forma-36-react-components/dist/styles.css";
import { get, filter, has } from "lodash";

import { TYPE_REF_SEARCH } from "../constants";
import CoveoReferenceSearchEntry from "./CoveoReferenceSearchEntry";

function CoveoReferenceSearchList({ sdk }) {
  const {
    field,
    space,
    dialogs: { openExtension: openDialogExtension },
    parameters: {
      instance: { searchPageName }
    }
  } = sdk;

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const detachValueChangeHandler = field.onValueChanged(setEntries);

    setEntries(field.getValue() || []);

    return () => {
      detachValueChangeHandler(setEntries);
    };
  }, [field]);

  const removeItem = useCallback(
    async id => {
      const newItems = filter(entries, ref => {
        return get(ref, "sys.id") !== id;
      });

      await field.setValue(newItems);
    },
    [entries, field]
  );

  const addItem = useCallback(
    async contentId => {
      const newItems = entries || [];

      newItems.push({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: contentId
        }
      });

      await field.setValue(newItems);
    },
    [entries, field]
  );

  const openDialog = async () => {
    const data = await openDialogExtension({
      width: "fullWidth",
      title: "Last Rev Coveo Reference Search",
      allowHeightOverflow: true,
      parameters: {
        searchPageName,
        type: TYPE_REF_SEARCH
      }
    });
    if (has(data, "contentId")) {
      addItem(get(data, "contentId"));
    }
  };

  // TODO: handle drag and drop
  return (
    <div className="coveoReferenceSearchList">
      {entries && entries.length ? (
        <EntityList>
          {entries.map(entry => (
            <CoveoReferenceSearchEntry
              space={space}
              contentId={get(entry, "sys.id")}
              removeHandler={removeItem}
            />
          ))}
        </EntityList>
      ) : null}
      <Button buttonType="primary" onClick={openDialog}>
        Search for content
      </Button>
    </div>
  );
}

export default CoveoReferenceSearchList;
