import React from 'react';
import { Button, IconButton, TextField, Select, Option, FormLabel } from '@contentful/forma-36-react-components';

const getButton = (label, buttonType, onClick, position) => {
  return <Button
    buttonType={buttonType}
    isFullWidth={false}
    loading={false}
    onClick={onClick}
    testId={`cf-ui-button-${label}-${position}`}
    data-testid={`cf-ui-button-${label}`}
    type="button">
    {label}
  </Button>;
};

const getIconButton = (label, buttonType, iconType, iconSize, onClick, position) => {
  return <IconButton
    buttonType={buttonType}
    iconProps={{ icon: iconType, size: iconSize }}
    label={label}
    onClick={onClick}
    testId={`cf-ui-button-${label}-${position}`} />;
};

const getOptions = (options, optionObject, position) => {
  return options.length > 0
    ? options.map(option => {

      return (
        <Option
          key={option}
          testId={`cf-ui-select-option-${option}-${position}`}
          value={option}>
          {(optionObject && optionObject[option]) || option}
        </Option>
      );
    })
    : [<Option />];
};

const getSelect = (options, onChange, { id = 'select1', name = id, disabled = false, optionObject, width = 'medium' }, value, position, className) => {
  return <Select
    className={className}
    id={id}
    name={name}
    onChange={onChange}
    testId={`cf-ui-select-${id}`}
    width={width}
    disabled={disabled}
    willBlurOnEsc
    value={value || (optionObject ? optionObject[options[0]] : options[0])}>
    {getOptions(options, optionObject, position)}
  </Select>;
};

const withLabel = (id, labelText, control) => {
  return <>
    <FormLabel htmlFor={id}
      required>
      {labelText}
    </FormLabel>
    {control()}
  </>;
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
    },
    textarea = false
  }) => {
  return <TextField
    className=""
    countCharacters={false}
    formLabelProps={{ requiredText }}
    helpText={helpText}
    id={id}
    labelText={labelText}
    name={name}
    onChange={onChange}
    required={required}
    data-testid={`cf-ui-text-field-${id}`}
    textInputProps={textInputProps}
    textarea={textarea}
    validationMessage={validationMessage}
    value={textValue}
    width="full" />;
};

export {
  getButton,
  getIconButton,
  getTextField,
  getOptions,
  getSelect,
  withLabel
};