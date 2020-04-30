/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-named-default */
import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import ColorPicker from './ColorPicker';
import UiExtensions from './UiExtensions';
import Seo from './Seo';
import SeoConfig from './Seo/SeoConfig';
import ExtensionsList from './ExtensionsList';
import history from '../history';
import NewFieldMockSdk from './UiExtensions/mockSdk';
import colorPickerMockSdk from './ColorPicker/mockSdk';

const App = ({ sdk, locations }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/"
          exact
          component={ExtensionsList} />
        <Route path="/color-picker"
          exact
          component={() => <ColorPicker sdk={sdk || colorPickerMockSdk}
            locations={locations} />} />
        <Route path="/localization-lookup"
          exact
          component={() => <UiExtensions sdk={sdk || NewFieldMockSdk}
            locations={locations} />} />
        <Route path="/seo"
          exact
          component={() => {
            const usedSdk = sdk;
            if(usedSdk.location.is(locations.LOCATION_APP)) {
              return <SeoConfig sdk={usedSdk}
                locations={locations} />;
            }
            return <Seo sdk={sdk || usedSdk}
              locations={locations} />;
          }}/>
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
    LOCATION_APP: PropTypes.string.isRequired,
  })
};

export default App;
