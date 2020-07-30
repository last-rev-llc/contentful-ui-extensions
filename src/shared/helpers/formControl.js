import React from 'react';
import { Button, IconButton, TextField } from '@contentful/forma-36-react-components';

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



const getTextField = (
  textValue, 
  onChange, 
  validationMessage, 
  { 
    id = 'input1', 
    name = id, 
    labelText = 'label1', 
    helpText = '', 
    required = false, 
    requiredText = required ? 'required' : '', 
    textInputProps = { 
      disabled: false, 
      placeholder: labelText, 
      type: 'text' 
    } 
  }) => {
  return <TextField
    className=""
    countCharacters={false}
    formLabelProps={{requiredText}}
    helpText={helpText}
    id={id}
    labelText={labelText}
    name={name}
    onChange={onChange}
    required={required}
    testId={`cf-ui-text-field-${id}`}
    textInputProps={textInputProps}
    textarea={false}
    validationMessage={validationMessage}
    value={textValue}
    width="full" />;
};

export {
  getButton,
  getIconButton,
  getTextField
};