import React, { useState, useEffect } from 'react';
import { init as initContentfulExtension } from 'contentful-ui-extensions-sdk';
import './HelloWorld.scss';

function HelloWorld() {
  const [api, setApi] = useState({});
  const [fieldValue, setFieldValue] = useState([]);

  useEffect(() => {
    initContentfulExtension((extensionApi) => {
      setApi(extensionApi);
      setFieldValue(extensionApi.field.getValue());
      extensionApi.window.startAutoResizer();
    });
  });


  return (
    <div id="">
      {console.log(api)}
      {console.log(fieldValue)}
      Hello World
    </div>
  );
}

export default HelloWorld;
