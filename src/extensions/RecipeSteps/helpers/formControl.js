import React from 'react';
import { 
  Textarea, 
  TextInput, 
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@contentful/forma-36-react-components';

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
    width="large" />;
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
    width="large" />;
};

const getButton = (label, buttonType, onClick) => {
  return <Button
    buttonType={buttonType}
    isFullWidth={false}
    loading={false}
    onClick={onClick}
    testId={`cf-ui-button-${label}`}
    type="button">
    {label}
  </Button>;
};

const getStepRows = (steps, edit, remove) => {
  return steps.map((step, index) => {
    const keyId = index;
    return (
      <TableRow key={keyId}>
        <TableCell>{step.title}</TableCell>
        <TableCell>{step.body}</TableCell>
        <TableCell>
          {getButton('Edit', 'primary', () => edit(index))}
          {getButton('Delete', 'negative', () => remove(index))}
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Body</TableCell>
              <TableCell>Actions</TableCell>
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
  getTextArea,
  getButton,
  getStepRows,
  getStepsTable
};