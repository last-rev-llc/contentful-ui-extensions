import React, { useState, useEffect } from 'react';
import { init as initContentfulExtension } from 'contentful-ui-extensions-sdk';
import GridLayout from 'react-grid-layout';
import '../../../../../node_modules/react-grid-layout/css/styles.css';
import '../../../../../node_modules/react-resizable/css/styles.css';
import './Layout.scss';

function Layout() {
  const [api, setApi] = useState({});
  const [fieldConfig, setFieldConfig] = useState({});

  useEffect(() => {
    initContentfulExtension((extensionApi) => {
      console.log('wtf');
      setApi(extensionApi);
      setFieldConfig(extensionApi.entry.fields.layoutConfig.getValue());
      extensionApi.window.startAutoResizer();
    });
  }, []);

  const handleLayoutChange = (layoutConfig) => {
    if (layoutConfig && layoutConfig.length > 0) {
      setFieldConfig(layoutConfig);
      api.entry.fields.layoutConfig.setValue(layoutConfig);
    }
  };
  console.log(api);
  if (api && api.field) {
    console.log('FIELD CONFIG', fieldConfig);
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

          {api.field.getValue().map((content) => (
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
  return null;
}

export default Layout;
