import React from 'react';
import {
  Select,
  Option,
  TextInput,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  FormLabel,
} from '@contentful/forma-36-react-components';
import { getIconButton } from '../../../shared/helpers';

const getTextInput = (textValue, onChange, { id = 'input1', name = id, type = 'text', placeholder = id }) => {
  return <TextInput
    className=""
    id={id}
    name={name}
    placeholder={placeholder}
    onChange={event => onChange(event)}
    required
    type={type}
    testId={`cf-ui-text-input-${id}`}
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
      testId={`cf-ui-label-${id}`}
      required>
      {labelText}
    </FormLabel>
    {control()}
  </>;
};

const getIngredientRows = (ingredients, edit, remove) => {
  return ingredients.map((ingredient, index) => {
    const keyId = index;
    return (
      <TableRow key={keyId}>
        <TableCell data-test-id="Ingredients-Table-Cell-Step">{ingredient.step}</TableCell>
        <TableCell data-test-id="Ingredients-Table-Cell-Ingredient">{ingredient.ingredient}</TableCell>
        <TableCell data-test-id="Ingredients-Table-Cell-ImperialQuantity">{`${ingredient.imperialQuantity} ${ingredient.imperialMeasure}`}</TableCell>
        <TableCell data-test-id="Ingredients-Table-Cell-MetricQuantity">{`${ingredient.metricQuantity} ${ingredient.metricMeasure}`}</TableCell>
        <TableCell className='col-actions'
          data-test-id="Ingredients-Table-Cell-Actions">
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
        <Table className='steps-table'
          data-test-id="Ingredients-Table">
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
  getIngredientRows,
  getIngredientsTable
};