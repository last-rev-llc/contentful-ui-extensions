import React from 'react';
import ReactDOM from 'react-dom';
import { init, locations } from 'contentful-ui-extensions-sdk';
import * as Sentry from '@sentry/react';
import App from './extensions/App';
import mockLocations from './__mocks__/mockLocations';

(()=> {
  Sentry.init({dsn: "https://745cf65377674adbaf85942851bbb125@o267347.ingest.sentry.io/5320754"});
  if(window.self !== window.top) {
    // Being loaded by an iFrame (Contentful)
    init(sdk => {
      ReactDOM.render(
        <App sdk={sdk}
          locations={locations} />,
        document.querySelector('#root')
      );
      sdk.window.startAutoResizer();
    });
  } else {
    // Loaded locally
    ReactDOM.render(
      <App locations={mockLocations} />,
      document.querySelector('#root')
    );
  }
})();
