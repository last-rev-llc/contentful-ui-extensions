import React from 'react';
import ReactDOM from 'react-dom';
import { init } from 'contentful-ui-extensions-sdk';
import App from './extensions/App';

(()=> {
  if(window.self !== window.top) {
    // Being loaded by an iFrame (Contentful)
    init(sdk => {
      ReactDOM.render(
        <App sdk={sdk} />,
        document.querySelector('#root')
      );
      sdk.window.startAutoResizer();
    });
  } else {
    // Loaded locally
    const sdk = {}; // Create empty object for component use later
    ReactDOM.render(
      <App />,
      document.querySelector('#root')
    );
  }
})();
