import React, { useState, useEffect } from 'react';
import {
  has, isArray, each, get,
} from 'lodash';
import { Button, Select } from '@contentful/forma-36-react-components';
import { init as initContentfulExtension } from 'contentful-ui-extensions-sdk';
import './Templates.scss';

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [api, setApi] = useState({});
  const [hasEntries, setHasEntries] = useState(true);

  useEffect(() => {
    console.log('USE EFFECT');
    initContentfulExtension(async (extensionApi) => {
      const getReferenceFieldEntries = async () => {
        const globalSettings = await extensionApi.space.getEntry('6sRmfqaqo4OD3E05ooNViv');
        setTemplates(get(globalSettings, 'fields.templates.en-US'));
      };
      setApi(extensionApi);
      getReferenceFieldEntries();
      setHasEntries(get(extensionApi, 'entry.fields.templates').getValue().length > 0);
      extensionApi.window.startAutoResizer();
    });
  }, []);

  const handModalOpen = () => {
    // TODO: Change this to be itself ID
    console.log('HANDLE OPEN', api.entry.fields.templates.getValue());
    api.dialogs.openExtension({
      id: '54j2jBSmPiNdUzF22TnER2',
      parameters: {
        openDialog: true,
        entries: api.entry.fields.templates.getValue(),
      },
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      position: 'center',
    }).then((data) => {
      console.log('SUCCESS', data);
    }).catch((error) => {
      console.log('ERROR', error);
    });
  };

  const WithButton = () => (
    <>
      <Button
        buttonType="positive"
        data-testid="template-new-button"
        onClick={() => {
          handModalOpen(true);
        }}
      >Create New Template
      </Button>
    </>
  );

  const WithDropdown = () => (
    <>
      <div>Please Select a Template to use</div>
      <Select data-testid="template-select-field">
        {templates.map((template) => (
          <option
            data-testid="template-select-option"
            key={Math.random()}
          >{template.name}
          </option>
        ))}
      </Select>
    </>
  );

  const WithTemplateCreateDialog = ({ entries }) => (
    <div className="create-new">
      {console.log(entries)}
      <h1>Create new template</h1>
      <table>
        <thead>

          <tr>
            <td>ByRef</td>
            <td>New</td>
            <td>Module Name</td>
          </tr>
        </thead>
        <tbody>
          {entries.map(() => (
            <tr>
              <td><input type="checkbox" /></td>
              <td><input type="checkbox" /></td>
              <td>Some Cards</td>
            </tr>
          ),
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div id="templates">
      {(get(api, 'parameters.invocation.openDialog'))
        ? (

          <WithTemplateCreateDialog entries={(get(api, 'parameters.invocation.entries'))}>
            {console.log('ENTRies', (get(api, 'parameters.invocation.entries')))}
          </WithTemplateCreateDialog>
        ) : (
          (hasEntries) ? (
            <WithButton />
          ) : (
            <WithDropdown />
          ))}

    </div>
  );
}

Templates.propTypes = {

};

export default Templates;
