/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-named-default */
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import ColorPicker from "./ColorPicker";
import LocalizationLookup from "./LocalizationLookup";
import LocaleZooms from "./LocaleZooms";
import ContentDiff from "./ContentDiff";
import Seo from "./Seo";
import RecipeSteps from "./RecipeSteps";
import RecipeIngredients from "./RecipeIngredients";
import SeoConfig from "./Seo/SeoConfig";
import ExtensionsList from "./ExtensionsList";
import history from "../history";
import localizationLookupMockSdk from "./LocalizationLookup/mockSdk";
import localeZoomsMockSdk from "./LocaleZooms/mockSdk";
import contentDiffMockSdk from "./ContentDiff/mockSdk";
import colorPickerMockSdk from "./ColorPicker/mockSdk";
import recipeStepsMockSdk from "./RecipeSteps/mockSdk";
import recipeIngredientsMockSdk from "./RecipeIngredients/mockSdk";

import BynderImage from "./BynderImage";
import { createMockSDK } from "./BynderImage/mockSdk";

const App = ({ sdk, locations }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={ExtensionsList} />
        <Route
          path="/color-picker"
          exact
          component={() => (
            <ColorPicker
              sdk={sdk || colorPickerMockSdk}
              locations={locations}
            />
          )}
        />
        <Route
          path="/localization-lookup"
          exact
          component={() => (
            <LocalizationLookup
              sdk={sdk || localizationLookupMockSdk}
              locations={locations}
            />
          )}
        />
        <Route
          path="/locale-zooms"
          exact
          component={() => (
            <LocaleZooms
              sdk={sdk || localeZoomsMockSdk}
              locations={locations}
            />
          )}
        />
        <Route
          path="/recipe-ingredients"
          exact
          component={() => (
            <RecipeIngredients
              sdk={sdk || recipeIngredientsMockSdk}
              locations={locations}
            />
          )}
        />
        <Route
          path="/recipe-steps"
          exact
          component={() => (
            <RecipeSteps
              sdk={sdk || recipeStepsMockSdk}
              locations={locations}
            />
          )}
        />
        <Route
          path="/content-diff"
          exact
          component={() => (
            <ContentDiff
              sdk={sdk || contentDiffMockSdk}
              locations={locations}
            />
          )}
        />
        <Route
          path="/seo"
          exact
          component={() => {
            const usedSdk = sdk;
            if (usedSdk.location.is(locations.LOCATION_APP_CONFIG)) {
              return <SeoConfig sdk={usedSdk} locations={locations} />;
            }
            return <Seo sdk={sdk || usedSdk} locations={locations} />;
          }}
        />
        <Route
          path="/bynder-image"
          exact
          component={() => (
            <BynderImage sdk={sdk || createMockSDK()} locations={locations} />
          )}
        />
      </Switch>
    </Router>
  );
};

App.propTypes = {
  sdk: PropTypes.object,
  locations: PropTypes.shape({
    LOCATION_ENTRY_FIELD: PropTypes.string.isRequired,
    LOCATION_ENTRY_FIELD_SIDEBAR: PropTypes.string.isRequired,
    LOCATION_ENTRY_SIDEBAR: PropTypes.string.isRequired,
    LOCATION_DIALOG: PropTypes.string.isRequired,
    LOCATION_ENTRY_EDITOR: PropTypes.string.isRequired,
    LOCATION_PAGE: PropTypes.string.isRequired,
    LOCATION_APP_CONFIG: PropTypes.string.isRequired
  })
};

export default App;
