/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-named-default */
import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import Address from './Address';
import Bynder from './Bynder';
import ColorPicker from './ColorPicker';
import LocalizationLookup from './LocalizationLookup';
import LocaleZooms from './LocaleZooms';
import ContentDiff from './ContentDiff';
import CoveoSearch from './CoveoSearch';
import OperatingHours from './OperatingHours';
import Seo from './Seo';
import PersonName from './PersonName';
import PhoneNumber from './PhoneNumber';
import RecipeSteps from './RecipeSteps';
import RecipeIngredients from './RecipeIngredients';
import FormStack from './FormStack';
import SeoConfig from './Seo/SeoConfig';
import ExtensionsList from './ExtensionsList';
import FormBuilder from './FormBuilder';

import history from '../history';

import addressMockSdk from './Address/mockSdk';
import bynderMockSdk from './Bynder/mockSdk';
import localizationLookupMockSdk from './LocalizationLookup/mockSdk';
import localeZoomsMockSdk from './LocaleZooms/mockSdk';
import contentDiffMockSdk from './ContentDiff/mockSdk';
import colorPickerMockSdk from './ColorPicker/mockSdk';
import coveoSearchMock from './CoveoSearch/mockSdk';
import personNameMockSdk from './PersonName/mockSdk';
import phoneNumberMockSdk from './PhoneNumber/mockSdk';
import operatingHoursMockSdk from './OperatingHours/mockSdk';
import recipeStepsMockSdk from './RecipeSteps/mockSdk';
import recipeIngredientsMockSdk from './RecipeIngredients/mockSdk';
import formStackMockSdk from './FormStack/mockSdk';
import formBuilderMockSdk from './FormBuilder/mockSdk';
import BynderImage from './BynderImage';
import { createMockSDK } from './BynderImage/mockSdk';

import { SDKContext } from '../contexts';

import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';

import { SDKContext } from '../context';

const App = ({ sdk, locations }) => {
  return (
    <SDKContext.Provider value={sdk}>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={ExtensionsList} />
          <Route
            path="/address"
            exact
            component={() => <Address sdk={sdk || addressMockSdk} locations={locations} />}
          />
          <Route path="/bynder" exact component={() => <Bynder sdk={sdk || bynderMockSdk} locations={locations} />} />
          <Route
            path="/color-picker"
            exact
            component={() => <ColorPicker sdk={sdk || colorPickerMockSdk} locations={locations} />}
          />
          <Route path="/coveo-search" exact component={() => <CoveoSearch sdk={sdk || coveoSearchMock} />} />
          <Route
            path="/localization-lookup"
            exact
            component={() => <LocalizationLookup sdk={sdk || localizationLookupMockSdk} locations={locations} />}
          />
          <Route
            path="/locale-zooms"
            exact
            component={() => <LocaleZooms sdk={sdk || localeZoomsMockSdk} locations={locations} />}
          />
          <Route
            path="/operating-hours"
            exact
            component={() => <OperatingHours sdk={sdk || operatingHoursMockSdk} />}
          />
          <Route
            path="/person-name"
            exact
            component={() => <PersonName sdk={sdk || personNameMockSdk} locations={locations} />}
          />
          <Route
            path="/phone-number"
            exact
            component={() => <PhoneNumber sdk={sdk || phoneNumberMockSdk} locations={locations} />}
          />
          <Route
            path="/recipe-ingredients"
            exact
            component={() => <RecipeIngredients sdk={sdk || recipeIngredientsMockSdk} locations={locations} />}
          />
          <Route
            path="/recipe-steps"
            exact
            component={() => <RecipeSteps sdk={sdk || recipeStepsMockSdk} locations={locations} />}
          />
          <Route
            path="/content-diff"
            exact
            component={() => <ContentDiff sdk={sdk || contentDiffMockSdk} locations={locations} />}
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
            path="/formstack"
            exact
            component={() => <FormStack sdk={sdk || formStackMockSdk} locations={locations} />}
          />
          <Route
            path="/bynder-image"
            exact
            component={() => <BynderImage sdk={sdk || createMockSDK()} locations={locations} />}
          />
          <Route
            path="/form-builder"
            exact
            component={() => <FormBuilder sdk={sdk || formBuilderMockSdk} locations={locations} />}
          />
        </Switch>
      </Router>
    </SDKContext.Provider>
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
