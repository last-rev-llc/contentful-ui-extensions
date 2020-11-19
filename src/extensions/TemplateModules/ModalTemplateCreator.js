/* eslint-disable react/forbid-prop-types */
import React, { useContext, useState } from 'react';
import { get, cloneDeep } from 'lodash';
import {
  Heading,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@contentful/forma-36-react-components';

import ModalLoading from './ModalLoading';
import { SDKContext } from '../../context';

import { getId, getTitle } from './CardEntry';
import { ModalStyle } from './styles';
import { getGlobalSettings, setGlobalTemplates } from './utils';

function cleanupEntry(entry) {
  const toReturn = cloneDeep(entry);

  // We'll use contentful to create an ID for us
  delete toReturn.sys.id;
  Object.keys(entry.fields).forEach((fieldName) => {
    toReturn.fields[fieldName] = '';
  });

  return entry;
}

function buildTemplateOptions(entries) {
  const toReturn = {};

  entries.forEach((entry) => {
    toReturn[getId(entry)] = {
      id: getId(entry),
      reftype: 'byref'
    };
  });

  return toReturn;
}

/**
 * Handle the saving of templates
 * When a user saves a template they have the option
 * to save each field as-is, or create new fields in contentful
 * when they load the template the next time.
 */
function TemplateCreatorDialog() {
  const sdk = useContext(SDKContext);

  const { entries } = sdk.parameters.invocation;

  const [isLoading, setLoading] = useState(false);
  const [templateOptions, setTemplateOptions] = useState(buildTemplateOptions(entries));
  const [templateName, setTemplateName] = useState('');

  if (isLoading) return <ModalLoading />;

  const handleRadioChange = (event) => {
    const input = event.target;

    const id = input.getAttribute('data-id');
    const reftype = input.getAttribute('data-reftype');

    setTemplateOptions({
      ...templateOptions,
      [input.getAttribute('data-id')]: {
        id,
        reftype,

        /**
         * If the user selects "new" we need to create an entry of the same type as
         * from the current template, but we'll remove values from fields etc.
         *
         * This will create a new content model in contentful
         * If byRef is selected, then we'll simply link to the current entry
         */
        entry: reftype === 'new' ? cleanupEntry(entries.find((entry) => id === getId(entry))) : null
      }
    });
  };

  const handleTemplateCreate = async () => {
    const globalSettings = await getGlobalSettings(sdk);
    const templates = get(globalSettings, 'fields.templates.en-US', []);

    templates.push({
      name: templateName,
      entries: Object.values(templateOptions)
    });

    setLoading(true);
    await setGlobalTemplates(sdk, templates);
    sdk.close({ templates });
  };

  const handleTemplateNameChange = (e) => {
    setTemplateName(e.currentTarget.value);
  };

  return (
    <ModalStyle>
      <Heading>Create New Template</Heading>
      <TextField
        id="template-name"
        type="text"
        placeholder="Enter Template Name"
        name="template-name"
        labelText="Template Name"
        helpText="Enter a descriptive name for your template for use at a later date."
        formLabelProps={{ requiredText: 'This field is required' }}
        required
        onChange={handleTemplateNameChange}
        value={templateName}
      />
      <hr />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="option">ByRef</TableCell>
            <TableCell className="option">New</TableCell>
            <TableCell className="sysId">ID</TableCell>
            <TableCell className="name">Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => {
            const id = getId(entry);

            const byNewChecked = templateOptions[id].reftype === 'new';
            const byRefChecked = templateOptions[id].reftype === 'byref';

            return (
              <TableRow key={id} className="entry">
                <TableCell>
                  <input
                    type="radio"
                    name={id}
                    data-id={id}
                    data-reftype="byref"
                    onChange={handleRadioChange}
                    checked={byRefChecked}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="radio"
                    name={id}
                    data-id={id}
                    data-reftype="new"
                    onChange={handleRadioChange}
                    checked={byNewChecked}
                  />
                </TableCell>
                <TableCell>{getTitle(entry)}</TableCell>
                <TableCell>{get(entry, 'fields.internalTitle.en-US')}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Button onClick={handleTemplateCreate} disabled={!templateName} buttonType="positive">
        Create Template
      </Button>
    </ModalStyle>
  );
}

export default TemplateCreatorDialog;
