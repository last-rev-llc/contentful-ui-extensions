import _ from 'lodash';

const createAssetHtml = (asset) => {
  if (!asset || _.isUndefined(_.get(asset, 'fields'))) return '';

  return `<div class='entry-name' data-test-id="cdd-asset-title">${asset.fields.title['en-US']}</div>
      <ul class='field-list-wrap'>
        <li className="diff-field-wrap"><img src="${asset.fields.file['en-US'].url}" data-test-id="cdd-asset-image"/></li>
      </ul>
  </div>`;
};

export default createAssetHtml;
