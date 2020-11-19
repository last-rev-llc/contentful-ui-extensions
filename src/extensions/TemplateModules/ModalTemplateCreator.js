/* eslint-disable react/forbid-prop-types */
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { get, set } from 'lodash';
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

import { SDKContext } from '../../context';

import { getId, getTitle } from './CardEntry';
import { ModalStyle } from './styles';
import { getGlobalSettings, setGlobalTemplates } from './utils';

function TemplateCreatorDialog() {
  const sdk = useContext(SDKContext);

  const { entries } = sdk.parameters.invocation;
  const [templateOptions, setTemplateOptions] = useState([]);
  const [templateName, setTemplateName] = useState('');

  const handleRadioChange = () => {
    const refArray = [];
    [...document.getElementsByTagName('input')].map((input) => {
      if (input.type === 'radio' && input.checked) {
        refArray.push({
          reftype: input.getAttribute('data-reftype'),
          id: input.getAttribute('data-id')
        });
      }
    });
    setTemplateOptions(refArray);
  };

  const handleTemplateCreate = async () => {
    const globalSettings = await getGlobalSettings(sdk);
    const templates = get(globalSettings, 'fields.templates.en-US', []);

    templates.push({
      name: templateName,
      options: templateOptions
    });

    await setGlobalTemplates(sdk, templates);
    sdk.close({ templateName, templates });
  };

  const handleTemplateNameChange = (e) => {
    setTemplateName(e.currentTarget.value);
  };

  const isChecked = (index, reftype) => {
    const curRow = templateOptions[index];
    if (curRow && curRow.reftype === reftype) {
      return true;
    }
    return false;
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
          {entries.map((entry, index) => {
            const id = getId(entry);

            const byNewChecked = isChecked(index, 'new');
            const byRefChecked = isChecked(index, 'byref');
            const someChecked = byNewChecked || byRefChecked;

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
                    data-id={entry.sys.contentType.sys.id}
                    data-reftype="new"
                    onChange={handleRadioChange}
                    checked={someChecked ? byNewChecked : true}
                  />
                </TableCell>
                <TableCell>{getTitle(entry)}</TableCell>
                <TableCell>{get(entry, 'fields.internalTitle.en-US')}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Button onClick={handleTemplateCreate} buttonType="positive">
        Create Template
      </Button>
    </ModalStyle>
  );
}

export default TemplateCreatorDialog;
