/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
// TODO: enable prop types
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDom from 'react-dom';
// import PropTypes from 'prop-types';
import { Button, Dropdown, DropdownList, DropdownListItem, EmptyState } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import { get, reject, some } from 'lodash';
import './CoveoSearchDialog.scss';
import { useCss, useScripts } from './CoveoSearchHooks';
import CoveoSearchService from './CoveoSearchService';
import CoveosSearchResultList from './CoveoSearchResultList';
import { TYPE_SAVED_SEARCH } from './constants';

function CoveoSearchDialog({ sdk }) {
  const {
    parameters: {
      installation: { endpoint },
      invocation: { searchPageName, type, query: existingState = null, numberOfItems: existingNumberOfItems = 3 }
    },
    notifier
  } = sdk;

  // TODO: figure out how to attach a click handler to search results.

  const [loading, setLoading] = useState(true);
  const [searchHtml, setSearchHtml] = useState(null);
  const [searchCss, setSearchCss] = useState(null);
  const [searchJs, setSearchJs] = useState(null);
  const [query, setQuery] = useState(existingState);
  const [results, setResults] = useState([]);
  const [fieldMapping, setFieldMapping] = useState(null);
  const [isDropdownIOpen, setDropdownOpen] = useState(false);
  const [numberOfItems, setNumberOfItems] = useState(existingNumberOfItems);
  const [selectedContentIds, setSelectedContentIds] = useState([]);

  useEffect(() => {
    async function fetchIt() {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify({
            action: 'GET_SEARCH_PAGE',
            payload: searchPageName
          })
        });

        const {
          // TODO: must return field mapping from endpoint... need to change these fields to be content type agnostic
          // ideally something like uwh_content_id and uwh_content_type is preferred.
          data: { searchPage, fieldMappings }
        } = await response.json();

        if (searchPage) {
          setLoading(false);
          setSearchHtml(searchPage.html);
          setSearchJs(searchPage.javascript);
          setSearchCss(searchPage.css);
          setFieldMapping(fieldMappings);
        } else {
          notifier.error(`No serach page found with name: ${searchPageName}`);
        }
      } catch (err) {
        notifier.error(`Unable to load search data: ${err.message}`);
      }
    }
    fetchIt();
  }, [endpoint, searchPageName, notifier]);

  const searchContainer = useRef(null);

  const selectReferenceHandler = useCallback(
    (contentId) => {
      const predicate = (id) => id === contentId;
      const newSelectedContent = some(selectedContentIds, predicate)
        ? reject(selectedContentIds, predicate)
        : [...selectedContentIds, contentId];
      setSelectedContentIds(newSelectedContent);
    },
    [selectedContentIds]
  );

  useEffect(() => {
    const el = document.querySelector('.CoveoResultList');
    if (el) {
      ReactDom.render(
        <CoveosSearchResultList
          results={results}
          type={type}
          fieldMapping={fieldMapping}
          selectReferenceHandler={selectReferenceHandler}
          selectedContent={selectedContentIds}
        />,
        el
      );
    }
  }, [fieldMapping, results, selectReferenceHandler, selectedContentIds, type]);

  const scriptsLoaded = useCallback(async () => {
    try {
      const coveoSearch = await CoveoSearchService.getInstance({ sdk });
      if (searchContainer.current) {
        coveoSearch.initCoveo({
          searchContainer: searchContainer.current.firstChild,
          listeners: {
            deferredQuerySuccess: (args) => {
              if (type === TYPE_SAVED_SEARCH) {
                setQuery(get(args, 'query'), null, 2);
              }
              setResults(get(args, 'results.results'));
            }
          },
          existingState
        });
      }
    } catch (err) {
      notifier.error(err);
    }
  }, [sdk, existingState, type, notifier]);

  useScripts(searchJs, scriptsLoaded);
  useCss(searchCss);

  if (!endpoint) {
    return (
      <EmptyState
        className="no-endpoint-msg"
        headingProps={{ text: 'Coveo Search' }}
        customImageElement={
          <img
            src="https://images.ctfassets.net/9o4l1mrd1tci/3ofhr7KXTuiqBhlwkm8h9h/a88289dcfa95fc23a9fcce8418aab94a/lastrev_logo_blk.png"
            alt=""
          />
        }
        descriptionProps={{
          text: 'No endpoint has been configured. Please configure one.'
        }}
        testId="CoveoSearchDialog-no-endpoint-msg"
      />
    );
  }
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      {type === TYPE_SAVED_SEARCH ? (
        <>
          <Button icon="Download" onClick={() => sdk.close({ query, numberOfItems })}>
            Save this search
          </Button>
          <Dropdown
            isOpen={isDropdownIOpen}
            onClose={() => setDropdownOpen(false)}
            toggleElement={
              <Button
                size="small"
                buttonType="muted"
                indicateDropdown
                onClick={() => setDropdownOpen(!isDropdownIOpen)}>
                Number of Items
              </Button>
            }>
            <DropdownList maxHeight={200}>
              {[...new Array(10)].map((_entry, i) => {
                const index = i + 1;
                return (
                  <DropdownListItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={`key-${index}`}
                    onClick={(e) => {
                      setNumberOfItems(parseInt(e.currentTarget.textContent, 10));
                      setDropdownOpen(false);
                    }}
                    isActive={index === numberOfItems}>
                    {index}
                  </DropdownListItem>
                );
              })}
            </DropdownList>
          </Dropdown>
        </>
      ) : (
        <Button icon="PlusCircle" onClick={() => sdk.close({ selectedContentIds })}>
          Save references
        </Button>
      )}

      <div ref={searchContainer} dangerouslySetInnerHTML={{ __html: searchHtml }} />
    </>
  );
}

// CoveoSearchDialog.propTypes = {
//   sdk: PropTypes.shape({
//     parameters: PropTypes.shape({
//       installation: PropTypes.shqape({
//         endpoint: PropTypes.string,
//       }).isRequired,
//       instance: PropTypes.shqape({
//         index: PropTypes.string.isRequired
//       }).isRequired,
//     }).isRequired,
//     location: PropTypes.string.isRequired
//   }).isRequired,
//   locations: PropTypes.shape({
//     LOCATION_ENTRY_FIELD: PropTypes.string.isRequired,
//     LOCATION_ENTRY_FIELD_SIDEBAR: PropTypes.string.isRequired,
//     LOCATION_ENTRY_SIDEBAR: PropTypes.string.isRequired,
//     LOCATION_DIALOG: PropTypes.string.isRequired,
//     LOCATION_ENTRY_EDITOR: PropTypes.string.isRequired,
//     LOCATION_PAGE: PropTypes.string.isRequired,
//     LOCATION_APP_CONFIG: PropTypes.string.isRequired,
//   }).isRequired,
// };

export default CoveoSearchDialog;
