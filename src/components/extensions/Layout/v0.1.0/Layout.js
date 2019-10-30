import React, { useState, useEffect } from 'react';
import { init as initContentfulExtension } from 'contentful-ui-extensions-sdk';
import { EntryCard, DropdownList, DropdownListItem } from '@contentful/forma-36-react-components';
import GridLayout from 'react-grid-layout';
import { get } from 'lodash';
import '../../../../../node_modules/react-grid-layout/css/styles.css';
import '../../../../../node_modules/react-resizable/css/styles.css';
import resolveEntries from '../../../../global/scripts/resolveEntries';
import './Layout.scss';

function Layout() {
  const [fieldConfig, setFieldConfig] = useState(false);
  const [api, setApi] = useState(false);
  const [fullEntries, setFullEntries] = useState(false);

  useEffect(() => {
    initContentfulExtension((extensionApi) => {
      const getFullEntries = async () => {
        setFullEntries(await resolveEntries(extensionApi.field.getValue(), extensionApi));
      };
      setApi(extensionApi);
      setFieldConfig(extensionApi.entry.fields.layoutConfig.getValue());
      getFullEntries();
      extensionApi.window.startAutoResizer();
    });
  }, []);

  const handleLayoutChange = (layoutConfig) => {
    if (layoutConfig && layoutConfig.length > 0) {
      setFieldConfig(layoutConfig);
      api.entry.fields.layoutConfig.setValue(layoutConfig);
    }
  };

  if (api && fieldConfig && fullEntries) {
    return (
      <>
        {console.log('API', api)}
        {console.log('FIELD CONFIG', fieldConfig)}
        {console.log('FIELD ENTRIES', fullEntries)}

        <GridLayout
          className="layout"
          layout={fieldConfig}
          cols={12}
          rowHeight={150}
          width={700}
          onLayoutChange={handleLayoutChange}
        >

          {fullEntries.map((content) => (
            <div
              key={content.sys.id}
            >
              <EntryCard
                title={get(content, 'fields.title.en-US', 'Homepage Hero')}
                description={get(content, 'fields.content.en-US', 'Some really cool description')}
                status="published"
                contentType={content.sys.contentType.sys.id}
                dropdownListElements={(
                  <>
                    <DropdownList>
                      <DropdownListItem isTitle>Actions</DropdownListItem>
                      <DropdownListItem href="#">Edit</DropdownListItem>
                      <DropdownListItem>
                        Remove
                      </DropdownListItem>
                      <DropdownListItem isTitle>Align</DropdownListItem>
                      <DropdownListItem>Right</DropdownListItem>
                      <DropdownListItem>Left</DropdownListItem>
                      <DropdownListItem>Center</DropdownListItem>

                    </DropdownList>
                  </>
                )}
              />
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
