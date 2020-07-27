import React from 'react';
import { Button, IconButton, Select, Option, FormLabel } from '@contentful/forma-36-react-components';

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

const getOptions = options => {
  console.log('options', options);
  return options.length > 0 
    ? options.map(option => {
      return (
        <Option
          key={option}
          testId={`cf-ui-select-option-${option}`}
          value={option}>
          {option}
        </Option>
      );
    })
    : [<Option />];
};

const getSelect = (options, onChange, { id = 'select1', name = id, disabled = false }) => {
  return <Select
    className=""
    id={id}
    name={name}
    onChange={onChange}
    testId={`cf-ui-select-${id}`}
    width="full"
    disabled={disabled}
    willBlurOnEsc>
    {getOptions(options)}
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

export {
  getButton,
  getIconButton,
  getOptions,
  getSelect,
  withLabel
};