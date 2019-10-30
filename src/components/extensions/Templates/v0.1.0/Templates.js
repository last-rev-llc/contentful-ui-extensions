import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { Button, Select } from '@contentful/forma-36-react-components';
import { init as initContentfulExtension } from 'contentful-ui-extensions-sdk';
import TemplateCreateDialog from './TemplateCreateDialog';
import './Templates.scss';

const fakeEntries = require('./fakeEntries');

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [api, setApi] = useState({});

  useEffect(() => {
    initContentfulExtension(async (extensionApi) => {
      const getTemplates = async () => {
        // TODO: Make this an instance variable
        const globalSettings = await extensionApi.space.getEntry('6AODsEr22eGLqXlvSEyJb3');
        setTemplates(get(globalSettings, 'fields.templates.en-US'));
      };
      setApi(extensionApi);
      getTemplates();
      extensionApi.window.startAutoResizer();
    });
  }, []);

  const handModalOpen = () => {
    api.dialogs.openExtension({
      id: api.ids.extension,
      parameters: {
        openDialog: true,
        entries: api.entry.fields.sections.getValue(), // TODO: Need to make field name an instance valriable
      },
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      position: 'center',
      width: 1000,
    }).then((data) => {
      setTemplates(data.templates);
      api.notifier.success(`${data.templateName} was succesfully created`);
    }).catch((error) => {
      console.log('ERROR', error);
    });
  };

  const handleTemplateSelectChange = (e) => {
    api.dialogs.openConfirm({
      title: `${e.target.value} Template`,
      message: `Do you want to add the ${e.target.value} template to the "sections" field?`,
      intent: 'positive',
      confirmLabel: 'Yes!',
      cancelLabel: 'No...',
    })
      .then((result) => {
        if (result) {
          const entries = api.entry.fields.sections.getValue();
          api.entry.fields.sections.setValue(entries.concat(fakeEntries));
        }
      });
  };

  return (
    <div id="templates">
      {(get(api, 'parameters.invocation.openDialog'))
        ? (
          <TemplateCreateDialog
            entries={(get(api, 'parameters.invocation.entries'))}
            api={api}
          />
        ) : (
          <>
            <Button
              buttonType="positive"
              data-testid="template-new-button"
              onClick={() => {
                handModalOpen(true);
              }}
            >Create New Template
            </Button>
            <div>Please Select a Template to use</div>
            <Select
              data-testid="template-select-field"
              onChange={handleTemplateSelectChange}
            >
              <option name="none">Select a Template</option>
              {templates.map((template) => (
                <option
                  data-testid="template-select-option"
                  key={Math.random()}
                  value={template.name}
                >{template.name}
                </option>
              ))}
            </Select>
          </>
        )}
    </div>
  );
}

Templates.propTypes = {

};

export default Templates;
