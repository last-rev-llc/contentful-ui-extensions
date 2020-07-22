import _ from 'lodash';

export const helpers = () => {};

export const arrayListTestId = "cdd-array-list";
export const arrayListItemTestId = "cdd-array-list-item";

export const createAssetHtml = (asset) => {
  if (!asset || _.isUndefined(_.get(asset, 'fields'))) return '';

  return `<div class='entry-name' data-test-id="cdd-asset-title">${asset.fields.title['en-US']}</div>
      <ul class='field-list-wrap'>
        <li className="diff-field-wrap"><img src="${asset.fields.file['en-US'].url}" data-test-id="cdd-asset-image"/></li>
      </ul>
  </div>`;
};

export const getArrayValue = (arrayField) => {
  const values = _.isArray(arrayField) ? arrayField : _.get(arrayField, 'value', []);
  if (!values.length) return '';
  const arrayValues = values.map(value => `<li class='array-value' data-test-id="${arrayListItemTestId}">${value}</li>`).join('');
  return `<ul class='array-field-wrap' data-test-id="${arrayListTestId}">${arrayValues}</ul>`;
};

export default helpers;
