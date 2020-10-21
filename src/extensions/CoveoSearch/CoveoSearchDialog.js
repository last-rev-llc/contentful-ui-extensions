/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
// TODO: enable prop types
import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDom from "react-dom";
// import PropTypes from 'prop-types';
import { Button, EmptyState } from "@contentful/forma-36-react-components";
import "@contentful/forma-36-react-components/dist/styles.css";
import { get } from "lodash";
import { useCss, useScripts } from "./CoveoSearchHooks";
import CoveoSearchService from "./CoveoSearchService";
import CoveosSearchResultList from "./CoveoSearchResultList";
import { TYPE_SAVED_SEARCH } from "./constants";

function CoveoReferenceSearchDialog({ sdk }) {
  const {
    parameters: {
      installation: { endpoint },
      invocation: {
        searchPageName,
        type,
        query: existingState = null,
        cq: existingCq = null
      }
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
  const [cq, setCq] = useState(existingCq);
  const [fieldMapping, setFieldMapping] = useState(null);

  useEffect(() => {
    async function fetchIt() {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({
            action: "GET_SEARCH_PAGE",
            payload: searchPageName
          })
        });

        const {
          // TODO: must return field mapping from endpoint... need to change these fields to be content type agnostic
          // ideally something like uwh_content_id and uwh_content_type is preferred.
          data: {
            html,
            css,
            javascript,
            // TODO: must return field mapping from endpoint... need to change these fields to be content type agnostic
            // ideally something like uwh_content_id and uwh_content_type is preferred.

            // hartd coding these for now...
            fieldMapping: fm = {
              contentId: "uwh_provider_content_id",
              contentType: "uwh_provider_content_type"
            }
          }
        } = await response.json();

        setLoading(false);
        setSearchHtml(html);
        setSearchJs(javascript);
        setSearchCss(css);
        setFieldMapping(fm);
      } catch (err) {
        notifier.error(`Unable to load search data: ${err.message}`);
      }
    }
    fetchIt();
  }, [endpoint, searchPageName, notifier]);

  const searchContainer = useRef(null);

  const selectReferenceHandler = useCallback(
    (contentId, contentType) => {
      sdk.close({
        contentId,
        contentType
      });
    },
    [sdk]
  );

  useEffect(() => {
    const el = document.querySelector(".CoveoResultList");
    if (el) {
      ReactDom.render(
        <CoveosSearchResultList
          results={results}
          type={type}
          fieldMapping={fieldMapping}
          selectReferenceHandler={selectReferenceHandler}
        />,
        el
      );
    }
  }, [fieldMapping, results, selectReferenceHandler, type]);

  const querySuccessHandler = useCallback(
    (args, state) => {
      if (type === TYPE_SAVED_SEARCH) {
        setQuery(state);
        setCq(get(args, "query.cq"));
      }

      setResults(get(args, "results.results"));
    },
    [type]
  );

  const scriptsLoaded = useCallback(async () => {
    try {
      const coveoSearch = await CoveoSearchService.getInstance({ sdk });
      if (searchContainer.current) {
        coveoSearch.initCoveo(
          searchContainer.current.firstChild,
          {
            querySuccess: querySuccessHandler
          },
          existingState
        );
      }
    } catch (err) {
      notifier.error(err);
    }
  }, [sdk, querySuccessHandler, existingState, notifier]);

  useScripts(searchJs, scriptsLoaded);
  useCss(searchCss);

  if (!endpoint) {
    return (
      <EmptyState
        className="no-endpoint-msg"
        headingProps={{ text: "Coveo Search" }}
        customImageElement={
          <img
            src="https://images.ctfassets.net/9o4l1mrd1tci/3ofhr7KXTuiqBhlwkm8h9h/a88289dcfa95fc23a9fcce8418aab94a/lastrev_logo_blk.png"
            alt=""
          />
        }
        descriptionProps={{
          text: "No endpoint has been configured. Please configure one."
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
        <Button icon="Code" onClick={() => sdk.close({ query, cq })}>
          Save this search
        </Button>
      ) : null}
      <div
        ref={searchContainer}
        dangerouslySetInnerHTML={{ __html: searchHtml }}
      />
    </>
  );
}

// CoveoReferenceSearchDialog.propTypes = {
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

export default CoveoReferenceSearchDialog;
