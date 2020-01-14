import React from 'react';
import ReactDOM from 'react-dom';
import { init } from 'contentful-ui-extensions-sdk';
import App from './extensions/App';

init(sdk => {
  ReactDOM.render(
    <App sdk={sdk} />,
    document.querySelector('#root')
  );
  sdk.window.startAutoResizer();
});