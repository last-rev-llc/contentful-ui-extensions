import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import Colors from './Colors/Colors';
import ExtensionsList from './ExtensionsList';
import history from '../history';

export default function App({ sdk }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/"
               exact
               component={ExtensionsList} />
        <Route path="/colors"
               exact
               component={() => <Colors sdk={sdk} />} />
      </Switch>
    </Router>
  )
};
