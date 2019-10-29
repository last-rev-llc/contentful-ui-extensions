import React, { useState, useEffect } from 'react';
import { init as initContentfulExtension } from 'contentful-ui-extensions-sdk';
import GridLayout from 'react-grid-layout';
import '../../../../../node_modules/react-grid-layout/css/styles.css';
import '../../../../../node_modules/react-resizable/css/styles.css';
import './Layout.scss';

function LayoutModule({ content }) {
  return (
    <div key={content.i}>
      <div className="controls">...</div>
      {content.i}
    </div>
  );
}
function Layout() {
  const [api, setApi] = useState({});
  const [fieldValue, setFieldValue] = useState([]);
  const [fieldConfig, setFieldConfig] = useState({});

  useEffect(() => {
    initContentfulExtension(async (extensionApi) => {
      console.log('USE EFFECT', extensionApi);
      console.log('USE EFFECT', extensionApi.entry.fields.layoutConfig.getValue());
      extensionApi.window.startAutoResizer();
      setApi(extensionApi);

      setFieldValue(extensionApi.field.getValue());
      setFieldConfig(extensionApi.entry.fields.layoutConfig.getValue());
    });
  }, []);

  const handleLayoutChange = (layoutConfig) => {
    console.log('API FIELDS', api.entry);
    console.log('API FIELDS', layoutConfig);
    console.log('API FIELDS', fieldConfig);
    if (layoutConfig && layoutConfig.length > 0) {
      setFieldConfig(layoutConfig);
      api.entry.fields.layoutConfig.setValue(layoutConfig);
    }
  };

  return (
    <>
      <GridLayout
        className="layout"
        layout={fieldConfig}
        cols={12}
        rowHeight={90}
        width={700}
        onLayoutChange={handleLayoutChange}
      >
        {/* {console.log(fieldValue)} */}
        {fieldValue.map((content) => (
          <div
            key={content.sys.id}
          >
            <div className="controls">...</div>
            {content.sys.id}
          </div>
        ))}
      </GridLayout>
      <div>Add new module</div>
    </>
  );
}

export default Layout;
