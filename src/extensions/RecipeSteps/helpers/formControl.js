import React from 'react';
import {
  Textarea,
  TextInput,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  FormLabel
} from '@contentful/forma-36-react-components';
import { getIconButton } from '../../../shared/helpers';

const getTextArea = (textValue, onChange) => {
  return <Textarea
    className=""
    id="body"
    maxLength={5000}
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
      data-testid={`cf-ui-label-${labelText}`}>
      {labelText}
    </FormLabel>
    <Textarea
      className=""
      id="body"
      maxLength={5000}
      name="body"
      placeholder="Body"
      onChange={event => onChange(event)}
      rows={4}
      data-testid={`cf-ui-body-${labelText}`}
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
    <FormLabel htmlFor={options.id}
      required>
      {labelText}
    </FormLabel>
    <TextInput
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
        <TableCell>{step.step}</TableCell>
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
        <Table className='steps-table'>
          <TableHead isSticky>
            <TableRow>
              <TableCell>Step Number</TableCell>
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