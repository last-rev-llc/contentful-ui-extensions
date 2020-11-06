/* eslint-disable react/prop-types */
import {
  DropdownList,
  DropdownListItem,
  EntityListItem
} from "@contentful/forma-36-react-components";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { getWorkflowState } from "../../../shared/modules/getWorkflowState";

function CoveoReferenceSearchEntry({ space, contentId, removeHandler }) {
  const [title, setTitle] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState(null);

  useEffect(() => {
    const load = async () => {
      const entry = await space.getEntry(contentId);
      const { displayField, name } = await space.getContentType(
        get(entry, "sys.contentType.sys.id")
      );
      setTitle(get(entry, `fields.${displayField}.en-US`)); // TODO: locale?
      setStatus(getWorkflowState(entry));
      setContentType(name);
      setLoading(false);
    };
    load();
  }, [space, contentId]);

  return (
    <EntityListItem
      title={title}
      status={status}
      entityType="entry"
      isLoading={loading}
      contentType={contentType}
      // withDragHandle TODO: no docs around how to handle drag
      dropdownListElements={
        <DropdownList>
          <DropdownListItem isTitle>Actions</DropdownListItem>
          <DropdownListItem onClick={() => removeHandler(contentId)}>
            Remove
          </DropdownListItem>
        </DropdownList>
      }
    />
  );
}

export default CoveoReferenceSearchEntry;
