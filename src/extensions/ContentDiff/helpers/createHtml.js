import { get, isUndefined } from 'lodash';
import { arrayLabelTestId, arrayWrapTestId, entryLabelTestId, entryValueTestId, entryWrapTestId } from '../constants';
import { getArrayValue, getValue } from './getters';

export const createHtmlForEntry = (entry) => {
  return `<li class="embedded-${entry.type} diff-field-wrap" key="${entry.id}" data-test-id="${entryWrapTestId}">
      <label htmlFor="name" data-test-id="${entryLabelTestId}">${entry.label}</label>
      <p data-test-id="${entryValueTestId}">${getValue(entry)}</p>
    </li>`;
};

export const createHtmlForAsset = (asset) => {
  if (!asset || isUndefined(get(asset, 'fields'))) return '';

  return `<li class="embedded-asset diff-field-wrap" key="${asset.sys.id}" data-test-id="${entryWrapTestId}">
      <label htmlFor="name" data-test-id="${entryLabelTestId}">${get(
    asset,
    "fields.title['en-US']",
    'No Label'
  )}</label>
      <div data-test-id="${entryValueTestId}"><img src="${get(
    asset,
    "fields.file['en-US'].url",
    'Not founds'
  )}" data-test-id="cdd-asset-image"/></div>
    </li>`;
};

export const createHtmlForArray = (field) => {
  return `<li class="embedded-${field.type} diff-field-wrap" key="${field.id}" data-test-id="${arrayWrapTestId}">
      <label htmlFor="name" data-test-id="${arrayLabelTestId}">${field.label}</label>
      ${getArrayValue(field)}
    </li>
  `;
};

export const createAssetHtml = (asset) => {
  if (!asset || isUndefined(get(asset, 'fields'))) return '';

  return `<div class='entry-name' data-test-id="cdd-asset-title">${asset.fields.title['en-US']}</div>
      <ul class='field-list-wrap'>
        <li className="diff-field-wrap"><img src="${asset.fields.file['en-US'].url}" data-test-id="cdd-asset-image"/></li>
      </ul>
  </div>`;
};
