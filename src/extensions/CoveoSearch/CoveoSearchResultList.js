import { CheckboxField } from '@contentful/forma-36-react-components';
import { get, some } from 'lodash';
/* eslint-disable react/prop-types */
import React from 'react';
import { TYPE_REF_SEARCH } from './constants';

function CoveoSearchResultList({
  results = [],
  type,
  fieldMapping,
  selectReferenceHandler,
  selectedContent: selectedContentIds
}) {
  const contentTypeKey = `raw.${get(fieldMapping, 'contentType')}`;
  const contentIdKey = `raw.${get(fieldMapping, 'contentId')}`;

  return results.length ? (
    <div>
      {results.map((result) => {
        const title = get(result, 'title');
        const contentType = get(result, contentTypeKey);
        const contentId = get(result, contentIdKey);
        const id = `${contentType}|${contentId}`;
        const isChecked = some(selectedContentIds, (selectedId) => selectedId === contentId);
        return (
          <div key={id} className="result">
            {type === TYPE_REF_SEARCH ? (
              <CheckboxField
                checked={isChecked}
                key={id}
                id={id}
                onChange={() => selectReferenceHandler(contentId)}
                labelText={title}
              />
            ) : (
              <span>{title}</span>
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <div>No results matching the search criteria</div>
  );
}

export default CoveoSearchResultList;
