import _ from 'lodash';

export const arrayListTestId = "cdd-array-list";
export const arrayListItemTestId = "cdd-array-list-item";

const getArrayValue = (arrayField) => {
  const values = _.isArray(arrayField) ? arrayField : _.get(arrayField, 'value', []);
  if (!values.length) return '';
  const arrayValues = values.map(value => `<li class='array-value' data-test-id="${arrayListItemTestId}">${value}</li>`).join('');
  return `<ul class='array-field-wrap' data-test-id="${arrayListTestId}">${arrayValues}</ul>`;
};

export default getArrayValue;