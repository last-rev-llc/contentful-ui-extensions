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
  FormLabel
} from '@contentful/forma-36-react-components';
import { getIconButton } from '../../../shared/helpers';

const getTextInput = (textValue, onChange, { id = 'input1', name = id, type = 'text', placeholder = id, required = false }) => {
  return <TextInput
    className=""
    id={id}
    name={name}
    placeholder={placeholder}
    onChange={event => onChange(event)}
    required={required}
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

const getSelect = (options, onChange, { id = 'select1', name = id }, value) => {
  return <Select
    className=""
    id={id}
    name={name}
    onChange={onChange}
    testId={`cf-ui-select-${id}`}
    width="full"
    willBlurOnEsc
    value={value}>
    {getOptions(options)}
  </Select>;
};

const withLabel = (id, labelText, control, required = false) => {
  return <>
    <FormLabel htmlFor={id}
      required={required}>
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
        <TableCell>{ingredient.step}</TableCell>
        <TableCell>{ingredient.ingredient}</TableCell>
        <TableCell>{ingredient.imperialQuantity ? `${ingredient.imperialQuantity} ${ingredient.imperialMeasure}` : ''}</TableCell>
        <TableCell>{ingredient.metricQuantity ? `${ingredient.metricQuantity} ${ingredient.metricMeasure}` : ''}</TableCell>
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
  getIngredientRows,
  getIngredientsTable
};