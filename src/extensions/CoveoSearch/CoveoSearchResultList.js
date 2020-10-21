import {
  DropdownList,
  DropdownListItem,
  EntityList,
  EntityListItem
} from "@contentful/forma-36-react-components";
import { get } from "lodash";
/* eslint-disable react/prop-types */
import React from "react";
import { TYPE_REF_SEARCH } from "./constants";

function CoveoSearchResultList({
  results,
  type,
  fieldMapping,
  selectReferenceHandler
}) {
  const contentTypeKey = `raw.${get(fieldMapping, "contentType")}`;
  const contentIdKey = `raw.${get(fieldMapping, "contentId")}`;

  return results && results.length ? (
    <>
      <EntityList>
        {results.map(result => {
          const title = get(result, "raw.systitle");
          const contentType = get(result, contentTypeKey);
          const contentId = get(result, contentIdKey);

          return (
            <EntityListItem
              key={`${contentType}|${contentId}`}
              title={title}
              entityType="entry"
              isLoading={false}
              contentType={contentType}
              dropdownListElements={
                type === TYPE_REF_SEARCH ? (
                  <DropdownList>
                    <DropdownListItem isTitle>Actions</DropdownListItem>
                    <DropdownListItem
                      onClick={() => selectReferenceHandler(contentId)}
                    >
                      Select
                    </DropdownListItem>
                  </DropdownList>
                ) : null
              }
            />
          );
        })}
      </EntityList>
    </>
  ) : (
    <div>No results matching the search criteria</div>
  );
}

export default CoveoSearchResultList;
