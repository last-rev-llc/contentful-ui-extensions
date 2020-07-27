import React from 'react';
import {
  Textarea,
  TextInput,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  FormLabel,
} from '@contentful/forma-36-react-components';
import { getIconButton } from '../../../shared/helpers';

const getTextArea = (textValue, onChange) => {
  return <Textarea
    className=""
    id="body"
    maxLength={500}
    name="body"
    placeholder="Body"
    onChange={event => onChange(event)}
    required
    rows={4}
    testId="cf-ui-body-textarea"
    value={textValue}
    width="full" />;
};

const getTextAreaWithLabel = (textValue, labelText, onChange) => {
  return <>
    <FormLabel htmlFor="body"
      required
      data-test-id="FormLabel-Body">
      {labelText}
    </FormLabel>
    <Textarea
      data-test-id="Textarea-Body"
      className=""
      id="body"
      maxLength={500}
      name="body"
      placeholder="Body"
      onChange={event => onChange(event)}
      required
      rows={4}
      testId="cf-ui-body-textarea"
      value={textValue}
      width="full" />
  </>;
};

const getTextInput = (textValue, onChange) => {
  return <TextInput
    className=""
    id="title"
    name="title"
    placeholder="Title"
    onChange={event => onChange(event)}
    required
    testId='cf-ui-text-input-title'
    value={textValue}
    width="full" />;
};

const getTextInputWithLabel = (textValue, labelText, onChange, options = { type: 'text', id: 'title', name: 'title', placeholder: 'Title' }) => {
  return <>
    <FormLabel htmlFor="title"
      data-test-id="FormLabel-Title"
      required>
      {labelText}
    </FormLabel>
    <TextInput
      data-test-id="TextInput-Title"
      className=""
      id={options.id}
      name={options.name}
      placeholder={options.placeholder}
      type={options.type}
      onChange={event => onChange(event)}
      required
      testId='cf-ui-text-input-title'
      value={textValue}
      width="full" />
  </>;
};

const getStepRows = (steps, edit, remove) => {
  return steps.sort((stepA, stepB) => stepA.step - stepB.step).map((step, index) => {
    const keyId = index;
    return (
      <TableRow key={keyId}>
        <TableCell data-test-id="Steps-Table-Cell-Step">{step.step}</TableCell>
        <TableCell data-test-id="Steps-Table-Cell-Title">{step.title}</TableCell>
        <TableCell data-test-id="Steps-Table-Cell-Body">{step.body}</TableCell>
        <TableCell>{step.title}</TableCell>
        <TableCell>{step.body}</TableCell>
        <TableCell className='col-actions'>
          {getIconButton('Click to edit this row', 'muted', 'Edit', 'medium', () => edit(index))}
          {getIconButton('Click to remove this row', 'negative', 'Delete', 'medium', () => remove(index))}
        </TableCell>
      </TableRow>
    );
  });
};

const getStepsTable = (steps, edit, remove) => {
  return steps.length === 0
    ? null
    : (
      <>
        <Table className='steps-table'
          data-test-id="Steps-Table">
          <TableHead isSticky>
            <TableRow>
              <TableCell>Step</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Body</TableCell>
              <TableCell className='col-actions' />
            </TableRow>
          </TableHead>
          <TableBody>
            {getStepRows(steps, edit, remove)}
          </TableBody>
        </Table>
      </>
    );
};

export {
  getTextInput,
  getTextInputWithLabel,
  getTextArea,
  getTextAreaWithLabel,
  getStepRows,
  getStepsTable
};