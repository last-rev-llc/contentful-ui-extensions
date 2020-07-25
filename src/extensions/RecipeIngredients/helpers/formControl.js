import React from 'react';
import { 
  Select, 
  Option,
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

const getTextInput = (textValue, onChange, { id = 'input1', name = id, type = 'text', placeholder = id }) => {
  return <TextInput
    className=""
    id={id}
    name={name}
    placeholder={placeholder}
    onChange={event => onChange(event)}
    required
    type={type}
    testId='cf-ui-text-input-title'
    value={textValue}
    width="full" />;
};

const getOptions = options => {
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

const getSelect = (options, onChange, { id = 'select1', name = id }) => {
  return <Select
    className=""
    id={id}
    name={name}
    onChange={onChange}
    testId={`cf-ui-select-${id}`}
    width="full"
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

const getIngredientRows = (ingredients, edit, remove) => {
  return ingredients.map((ingredient, index) => {
    const keyId = index;
    return (
      <TableRow key={keyId}>
        <TableCell>{ingredient.step}</TableCell>
        <TableCell>{ingredient.ingredient}</TableCell>
        <TableCell>{`${ingredient.imperialQuantity} ${ingredient.imperialMeasure}`}</TableCell>
        <TableCell>{`${ingredient.metricQuantity} ${ingredient.metricMeasure}`}</TableCell>
        <TableCell className='col-actions'>
          {getIconButton('Click to edit this row', 'muted', 'Edit', 'medium', () => edit(index))}
          {getIconButton('Click to remove this row', 'negative', 'Delete', 'medium', () => remove(index))}
        </TableCell>
      </TableRow>
    );
  });
};

const getIngredientsTable = (ingredients, edit, remove) => {
  return ingredients.length === 0
    ? null 
    : (
      <>
        <Table className='steps-table'>
          <TableHead isSticky>
            <TableRow>
              <TableCell>Step</TableCell>
              <TableCell>Ingredient</TableCell>
              <TableCell>Imperial Measurement</TableCell>
              <TableCell>Metric Measurement</TableCell>
              <TableCell className='col-actions' />
            </TableRow>
          </TableHead>
          <TableBody>
            {getIngredientRows(ingredients, edit, remove)}
          </TableBody>
        </Table>
      </>
    );
};

export {
  getTextInput,
  getOptions,
  getSelect,
  withLabel,
  getButton,
  getIconButton,
  getIngredientRows,
  getIngredientsTable
};