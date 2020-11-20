import React from 'react';
import { Textarea, TextInput, TableCell, TableRow, FormLabel } from '@contentful/forma-36-react-components';
import { getIconButton } from '../../../shared/helpers';
import { sortedKeys, withoutId } from './utils';

const getTextArea = (textValue, onChange) => {
  return (
    <Textarea
      className=""
      id="body"
      maxLength={5000}
      name="body"
      placeholder="Body"
      onChange={(event) => onChange(event)}
      required
      rows={4}
      testId="cf-ui-body-textarea"
      value={textValue}
      width="full"
    />
  );
};

const getTextAreaWithLabel = (textValue, labelText, onChange) => {
  return (
    <>
      <FormLabel htmlFor="body" data-testid={`cf-ui-label-${labelText}`}>
        {labelText}
      </FormLabel>
      <Textarea
        className=""
        id="body"
        maxLength={5000}
        name="body"
        placeholder="Body"
        onChange={(event) => onChange(event)}
        rows={4}
        data-testid={`cf-ui-body-${labelText}`}
        value={textValue}
        width="full"
      />
    </>
  );
};

const getTextInput = (textValue, onChange) => {
  return (
    <TextInput
      className=""
      id="title"
      name="title"
      placeholder="Title"
      onChange={(event) => onChange(event)}
      required
      testId="cf-ui-text-input-title"
      value={textValue}
      width="full"
    />
  );
};

const getTextInputWithLabel = (
  textValue,
  labelText,
  onChange,
  options = { type: 'text', id: 'title', name: 'title', placeholder: 'Title' }
) => {
  return (
    <>
      <FormLabel htmlFor={options.id} required>
        {labelText}
      </FormLabel>
      <TextInput
        className=""
        id={options.id}
        name={options.name}
        placeholder={options.placeholder}
        type={options.type}
        onChange={(event) => onChange(event)}
        required
        testId="cf-ui-text-input-title"
        value={textValue}
        width="full"
      />
    </>
  );
};

const getStepRows = (steps, edit, remove) => {
  return steps
    .filter(({ disabled }) => !disabled)
    .sort((stepA, stepB) => stepA.id - stepB.id)
    .map((step, index) => (
      <TableRow key={step.id}>
        {sortedKeys(withoutId(step)).map((key) => (
          <TableCell key={`${step.id}-${key}`}>{step[key]}</TableCell>
        ))}
        <TableCell className="col-actions">
          {getIconButton('Click to edit this row', 'muted', 'Edit', 'medium', () => edit(index))}
          {getIconButton('Click to remove this row', 'negative', 'Delete', 'medium', () => remove(index))}
        </TableCell>
      </TableRow>
    ));
};

export { getTextInput, getTextInputWithLabel, getTextArea, getTextAreaWithLabel, getStepRows };
