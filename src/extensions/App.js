/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-named-default */
import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import ColorPicker from './ColorPicker';
import FormStack from './FormStack';
import LivePreview from './LivePreview';
import PreviewButton from './LivePreview/PreviewButton';
import Seo from './Seo';
import SeoConfig from './Seo/SeoConfig';
import ExtensionsList from './ExtensionsList';
import history from '../history';

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
        <Route path="/formstack"
          exact
          component={() => <FormStack sdk={sdk || colorPickerMockSdk}
            locations={locations} />} />
        <Route path="/preview"
          exact
          component={() => <LivePreview sdk={sdk || {}}
            locations={locations} />} />
        <Route path="/preview-btn"
          exact
          component={() => <PreviewButton sdk={sdk || {}}
            locations={locations} />} />
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
