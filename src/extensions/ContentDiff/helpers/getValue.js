import { get } from 'lodash';
import { fieldTypes, linkTypes } from '../constants';

const getTextValue = (field) => {
  let value = escape(field.value)
    .replace('&lt;code&gt;', '<code>')
    .replace('&lt;/code&gt;', '</code>');
  if (field.textType === 'markdown' || field.textType === 'multipleLine' || value.indexOf('<code>') > -1) {
    value = `<pre>${value}</pre>`;
  }
  return value;
};

export default (field) => {
  let value;
  if (field) {
    if (field.type === fieldTypes.symbol || field.type === fieldTypes.text) {
      value = getTextValue(field);
    } else if (field.type === fieldTypes.link && field.linkType === linkTypes.asset) {
      value = get(field, 'asset', get(field, 'value'));
    } else if (field.type === fieldTypes.link && field.linkType === linkTypes.entry) {
      const displayField = get(field, 'entryContentType.displayField');
      value = get(field, `entry.fields['${displayField}']['en-US']`);
    }
  }
  return value;
};
