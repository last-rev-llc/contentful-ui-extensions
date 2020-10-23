/* eslint-disable react/prop-types */
// TODO: enable proptypes
import React, { useCallback } from "react";
import { TextLink } from "@contentful/forma-36-react-components";
import { MultipleEntryReferenceEditor } from "@contentful/field-editor-reference";
import "@contentful/forma-36-react-components/dist/styles.css";
import { get, has } from "lodash";

import { TYPE_REF_SEARCH } from "../constants";

function CoveoReferenceSearchFieldDisplay({ sdk }) {
  const {
    field,
    dialogs: { openExtension: openDialogExtension },
    parameters: {
      instance: { searchPageName }
    }
  } = sdk;

  const addItem = useCallback(
    contentId => {
      const items = field.getValue() || [];
      const newItems = Array.from(items);
      newItems.splice(items.length, 0, {
        sys: {
          type: "Link",
          linkType: "Entry",
          id: contentId
        }
      });
      field.setValue(newItems);
    },
    [field]
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

  return (
    <div className="coveoReferenceSearchList">
      <MultipleEntryReferenceEditor
        viewType="link"
        sdk={sdk}
        parameters={{
          instance: {
            canCreateEntity: true,
            canLinkEntity: true
          }
        }}
        renderCustomActions={() => (
          <TextLink icon="Search" onClick={openDialog}>
            Search for content
          </TextLink>
        )}
      />
    </div>
  );
}

export default CoveoReferenceSearchFieldDisplay;
