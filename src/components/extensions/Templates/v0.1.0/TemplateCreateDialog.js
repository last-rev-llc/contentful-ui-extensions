/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get, set, startCase } from 'lodash';
import {
  Heading, Button, TextField, Table, TableHead, TableBody, TableRow, TableCell,
} from '@contentful/forma-36-react-components';
import resolveEntries from '../../../../global/scripts/resolveEntries';
import './Templates.scss';

function TemplateCreateDialog({ entries, api }) {
  const [fullEntries, setFullEntries] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [templateName, setTemplateName] = useState('');
  // TODO: Make this an instance variable
  const GLOBALSETTINGS_ID = '6AODsEr22eGLqXlvSEyJb3';

  useEffect(() => {
    const getFullEntries = async () => {
      setFullEntries(await resolveEntries(entries, api));
    };
    getFullEntries();
  }, []);

  const handleRadioChange = () => {
    const refArray = [];
    [...document.getElementsByTagName('input')].map((input) => {
      if (input.type === 'radio' && input.checked) {
        refArray.push({
          reftype: input.getAttribute('data-reftype'),
          id: input.getAttribute('data-id'),
        });
      }
    });
    setTemplateOptions(refArray);
  };

  const handleTemplateCreate = async () => {
    const globalSettings = await api.space.getEntry(GLOBALSETTINGS_ID);
    const templates = get(globalSettings, 'fields.templates.en-US');

    templates.push({
      name: templateName,
      options: templateOptions,
    });

    api.space.updateEntry(set(globalSettings, 'fields.templates.en-US', templates));
    api.close({ templateName, templates });
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
    <div className="create-new">
      <Heading>Create New Template</Heading>
      <hr />
      <TextField
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
          {fullEntries.map((entry, index) => (
            <TableRow
              key={Math.random()}
              className="entry"
            >
              <TableCell>
                <input
                  type="radio"
                  name={entry.sys.id}
                  data-id={entry.sys.id}
                  data-reftype="byref"
                  onChange={handleRadioChange}
                  checked={isChecked(index, 'byref')}
                />
              </TableCell>
              <TableCell>
                <input
                  type="radio"
                  name={entry.sys.id}
                  data-id={entry.sys.contentType.sys.id}
                  data-reftype="new"
                  onChange={handleRadioChange}
                  checked={isChecked(index, 'new')}
                />
              </TableCell>
              <TableCell>{startCase(entry.sys.contentType.sys.id)}</TableCell>
              <TableCell>{get(entry, 'fields.headline.en-US')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={handleTemplateCreate}
        buttonType="positive"
      >Create Template
      </Button>
    </div>
  );
}

TemplateCreateDialog.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  api: PropTypes.object.isRequired,
};

export default TemplateCreateDialog;
