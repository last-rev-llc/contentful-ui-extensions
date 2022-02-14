import React from 'react';
import {
  Button,
  IconButton,
  TextField,
  Select,
  Option,
  FormLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@contentful/forma-36-react-components';

const getButton = (label, buttonType, onClick, position, className) => {
  return (
    <Button
      buttonType={buttonType}
      isFullWidth={false}
      loading={false}
      onClick={onClick}
      testId={`cf-ui-button-${label}-${position}`}
      data-testid={`cf-ui-button-${label}`}
      type="button"
      className={className}>
      {label}
    </Button>
  );
};

const getIconButton = (label, buttonType, iconType, iconSize, onClick, position) => {
  return (
    <IconButton
      buttonType={buttonType}
      iconProps={{ icon: iconType, size: iconSize }}
      label={label}
      onClick={onClick}
      testId={`cf-ui-button-${label}-${position}`}
    />
  );
};

const getOptions = (options, optionObject, position) => {
  return options.length > 0
    ? options.map((option) => {
        return (
          <Option key={option} testId={`cf-ui-select-option-${option}-${position}`} value={option}>
            {(optionObject && optionObject[option]) || option}
          </Option>
        );
      })
    : [<Option />];
};

const getSelect = (
  options,
  onChange,
  { id = 'select1', name = id, disabled = false, optionObject, width = 'medium' },
  value,
  position,
  className
) => {
  return (
    <Select
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
    </Select>
  );
};

const withLabel = (id, labelText, control) => {
  return (
    <>
      <FormLabel htmlFor={id} required>
        {labelText}
      </FormLabel>
      {control()}
    </>
  );
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
    textarea = false,
    className = ''
  }
) => {
  return (
    <TextField
      className={className}
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
      width="full"
    />
  );
};

const getTableRow = (row, rowIndex, getTableCell, headers) => {
  return (
    <TableRow key={`${rowIndex}`}>
      {headers.map((key) => {
        return <TableCell key={`${rowIndex}-${key}`}>{getTableCell(row, key, rowIndex)}</TableCell>;
      })}
    </TableRow>
  );
};

const getBulkEditingTable = (headers, rows, getTableCell) => {
  return (
    <div id="bulk-editing">
      <p>
        This view allows you to edit all fields in one window. <br />
        <strong>Important: Please use the Save Changes button at the bottom.</strong> If you close this window without
        saving, your changes will be lost!{' '}
      </p>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((v) => {
              return <TableCell key={`${v}-bulk-header`}>{v}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            return getTableRow(row, index, getTableCell, headers);
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export { getButton, getIconButton, getTextField, getOptions, getSelect, withLabel, getBulkEditingTable };
