import React from 'react';
import { 
  Textarea, 
  TextInput, 
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  FormLabel,
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
    width="full" />;
};

const getTextAreaWithLabel = (textValue, labelText, onChange) => {
  return  <>
    <FormLabel htmlFor="body"
      required>
      {labelText}
    </FormLabel>
    <Textarea
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

const getTextInputWithLabel = (textValue, labelText, onChange) => {
  return <>
    <FormLabel htmlFor="title"
      required>
      {labelText}
    </FormLabel>
    <TextInput
      className=""
      id="title"
      name="title"
      placeholder="Title"
      onChange={event => onChange(event)}
      required
      testId='cf-ui-text-input-title'
      value={textValue}
      width="full" />
  </>;
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

const getIconButton = (label, buttonType, iconType, iconSize, onClick) => {
  return <IconButton
    buttonType={buttonType}
    iconProps={{ icon:iconType, size:iconSize }}
    label={label}
    onClick={onClick}
    testId={`cf-ui-button-${label}`}/>;
};

const getStepRows = (steps, edit, remove) => {
  return steps.map((step, index) => {
    const keyId = index;
    return (
      <TableRow key={keyId}>
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
  getButton,
  getIconButton,
  getStepRows,
  getStepsTable
};