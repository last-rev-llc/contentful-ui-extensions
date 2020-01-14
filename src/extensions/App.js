import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import ColorPicker from './ColorPicker';
import ExtensionsList from './ExtensionsList';
import history from '../history';
import sdkProps from '../sdkPropTypes';

import mockSdk from './ColorPicker/mockSdk';

const App = ({ sdk }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/"
               exact
               component={ExtensionsList} />
        <Route path="/color-picker"
               exact
               component={() => <ColorPicker sdk={sdk || mockSdk} />} />
        <Route path="/seo"
               exact
               component={() => <ColorPicker sdk={sdk || mockSdk} />} />
      </Switch>
    </Router>
  )
};

App.propTypes = {
  sdk: sdkProps.isRequired,
};

export default App;
