/* eslint-disable react/require-default-props */
/* eslint-disable import/no-named-default */
import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import ColorPicker from './ColorPicker';
import Seo from './Seo';
import ExtensionsList from './ExtensionsList';
import history from '../history';
import sdkProps from '../sdkPropTypes';

import {default as colorPickerMockSdk} from './ColorPicker/mockSdk';
import {default as seoColorPickerMockSdk} from './Seo/mockSdk';

const App = ({ sdk }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/"
          exact
          component={ExtensionsList} />
        <Route path="/color-picker"
          exact
          component={() => <ColorPicker sdk={sdk || colorPickerMockSdk} />} />
        <Route path="/seo"
          exact
          component={() => <Seo sdk={sdk || seoColorPickerMockSdk} />} />
      </Switch>
    </Router>
  );
};

App.propTypes = {
  sdk: sdkProps,
};

export default App;