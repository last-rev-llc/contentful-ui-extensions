import { get, isArray, escape } from 'lodash';
import { fieldTypes, linkTypes, arrayListItemTestId, arrayListTestId } from '../constants';

export const getId = (field) => {
  return field.id;
};

export const getType = (field) => {
  return field.type;
};

export const getLabel = (field) => {
  return field.label;
};

export const getArrayType = (field) => {
  return field.arrayType;
};

export const getTextValue = (field) => {
  let value = escape(field.value)
    .replace('&lt;code&gt;', '<code>')
    .replace('&lt;/code&gt;', '</code>');
  if (field.textType === 'markdown' || field.textType === 'multipleLine' || value.indexOf('<code>') > -1) {
    value = `<pre>${value}</pre>`;
  }
  return value;
};

export const getValue = (field) => {
  let value;
  if (field) {
    if (field.type === fieldTypes.symbol || field.type === fieldTypes.text) {
      value = getTextValue(field);
    } else if (field.type === fieldTypes.link && field.linkType === linkTypes.asset) {
      value = get(field, 'asset');
    } else if (field.type === fieldTypes.link && field.linkType === linkTypes.entry) {
      const displayField = get(field, 'entryContentType.displayField');
      value = get(field, `entry.fields['${displayField}']['en-US']`);
    } else {
      value = get(field, 'value');
    }
  }
  return value;
};

export const getArrayValue = (arrayField) => {
  const values = isArray(arrayField) ? arrayField : get(arrayField, 'value', []);
  if (!values.length) return '';
  const arrayValues = values
    .map((value) => `<li class='array-value' data-test-id="${arrayListItemTestId}">${value}</li>`)
    .join('');
  return `<ul class='array-field-wrap' data-test-id="${arrayListTestId}">${arrayValues}</ul>`;
};
