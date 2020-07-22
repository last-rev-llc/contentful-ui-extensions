import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import '@contentful/forma-36-react-components/dist/styles.css';
import diff from 'node-htmldiff';
import './ContentDiff.scss';
import { createAssetHtml, getArrayValue } from './shared/helpers';

const fieldTypes = {
  richText: 'RichText', 
  symbol: 'Symbol',
  object: 'Object',
  array: 'Array',
  link: 'Link',
  text: 'Text'
};

const getTextDiff = ({id, oldText, newText, fieldType}) => {
  const changedClass = newText === oldText ? 'no-change' : 'change';
  
  return (
    <div className="diff-field-line-wrap"
      key={id}
      data-field-type={fieldType}
      data-test-id="cdd-diff-fields">
      <div className={`diff-text diff-text_snapshot ${changedClass}`}
        data-test-id="cdd-old-text"
        dangerouslySetInnerHTML={{__html: oldText}} />
      <div className={`diff-text diff-text_changed ${changedClass}`}
        data-test-id="cdd-diff-text"
        dangerouslySetInnerHTML={{__html: diff(oldText, newText)}}/>
      <div className={`diff-text diff-text_current ${changedClass}`}
        data-test-id="cdd-new-text"
        dangerouslySetInnerHTML={{__html: newText}}/>
    </div>
  );
};

getTextDiff.propTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  oldText: PropTypes.string.isRequired,
  newText: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired
}).isRequired;

const getFields = (field) => {
  if (_.isNil(field) || _.isNil(_.get(field, 'type'))) return '';
  let result;

  switch (field.type) {
  case fieldTypes.richText:
    result = getTextDiff({ id: 0, oldText: _.get(field, 'content.oldValue', ''), newText: _.get(field, 'content.currentValue', ''), fieldType: field.type });
    break;
  
  case fieldTypes.symbol:
    result = getTextDiff({ id: 0, oldText: _.escape(_.get(field, 'oldValue', '')), newText: _.escape(_.get(field, 'currentValue', '')), fieldType: field.type });
    break;

  case fieldTypes.text:
    result = getTextDiff({ id: 0, oldText: _.get(field, 'oldValue', ''), newText: _.get(field, 'currentValue', ''), fieldType: field.type });
    break;
  
  case fieldTypes.object:
    // result = renderTextInfo({ id: 0, oldText: oldFields[field.id]["en-US"], newText: field.value });
    break;
  
  case fieldTypes.array:
    if (field.arrayType === fieldTypes.symbol) {
      result = getTextDiff({ id: 0, oldText: getArrayValue(_.get(field, 'oldValue', [])), newText: getArrayValue(_.get(field, 'currentValue', [])), fieldType: field.type });
    }
    break;

  case fieldTypes.link:
    result = getTextDiff({ id: 0, oldText: createAssetHtml(_.get(field, 'oldValue')), newText: createAssetHtml(_.get(field, 'currentValue')), fieldType: field.type });
    break;
    
  default:
    break;
  }
  return result;
};

const getFieldInfo = (id, field) => {
  return (
    <li className="diff-field-wrap" 
      key={id}>
      <label htmlFor="fieldLabel" 
        data-test-id="cdd-field-label">
        {field.label}
      </label>
      {getFields(field)}
    </li>
  );
};

const getFieldTables = (fields) => {
  const fieldTable = fields.map((field, index) => getFieldInfo(index, field));
  return fieldTable;
};

const getError = message => {
  return (
    <div className='error-message'>
      <p>{message}</p>
    </div>
  );
};

export const ContentDiffDialog = ({ sdk }) => {
  return sdk.parameters.invocation.fields.length > 0 
    ? (
      <div>
        <ul className='field-list-wrap'>{getFieldTables(sdk.parameters.invocation.fields)}</ul>
      </div>
    )
    : getError('No fields returned');
};

ContentDiffDialog.propTypes = {
  sdk: PropTypes.shape({
    parameters: PropTypes.shape({
      invocation: PropTypes.shape({
        fields: PropTypes.array.isRequired
      })
    }),
  }).isRequired
};

export {
  getTextDiff,
  getFields,
  getFieldInfo,
  getFieldTables,
  getArrayValue
};

export default ContentDiffDialog;