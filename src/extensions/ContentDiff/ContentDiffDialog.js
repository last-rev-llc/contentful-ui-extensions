/* eslint-disable react/no-danger */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compact, get, head, isArray, isNil, join, startCase, escape } from 'lodash';
import '@contentful/forma-36-react-components/dist/styles.css';
import diff from 'node-htmldiff';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import './ContentDiff.scss';
import {
  addRemovedOldFields,
  createAssetHtml,
  createContentSimpleObjects,
  createHtmlForArray,
  createHtmlForAsset,
  createHtmlForEntry,
  getArrayType,
  getArrayValue,
  getAsset,
  getEntryByDate,
  getId,
  getLabel,
  getType,
  getValue,
} from './helpers';
import { entryWrapTestId, fieldTypes, linkTypes, paragraphFieldTypes, richTextFieldTypes } from './constants';

const getTextDiff = ({ oldText, newText, fieldType }) => {
  const changedClass = newText === oldText ? 'no-change' : 'change';

  return (
    <div className="diff-field-line-wrap" data-field-type={fieldType} data-test-id="cdd-diff-fields">
      <div
        className={`diff-text diff-text_snapshot ${changedClass}`}
        data-test-id="cdd-old-text"
        dangerouslySetInnerHTML={{ __html: oldText }}
      />
      <div
        className={`diff-text diff-text_changed ${changedClass}`}
        data-test-id="cdd-diff-text"
        dangerouslySetInnerHTML={{ __html: diff(oldText, newText) }}
      />
      <div
        className={`diff-text diff-text_current ${changedClass}`}
        data-test-id="cdd-new-text"
        dangerouslySetInnerHTML={{ __html: newText }}
      />
    </div>
  );
};

getTextDiff.propTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  oldText: PropTypes.string.isRequired,
  newText: PropTypes.string.isRequired,
  fieldType: PropTypes.string.isRequired,
}).isRequired;

const renderFieldDiff = (field) => {
  const fieldType = get(field, 'type');

  if (isNil(fieldType)) return '';
  let getter;

  switch (fieldType) {
    case fieldTypes.richText:
      getter = (key) => get(field, `content['${key}']`, '');
      break;

    case fieldTypes.symbol:
      getter = (key) => escape(get(field, key, ''));
      break;

    case fieldTypes.text:
    case fieldTypes.boolean:
      getter = (key) => get(field, key, '');
      break;
    case fieldTypes.object:
      // This seems to work, but needs further testing on complex JSON content
      getter = (key) => `<pre>${JSON.stringify(get(field, key, ''), null, 2)}</pre>`;
      break;

    case fieldTypes.array:
      if (field.arrayType === fieldTypes.symbol) {
        getter = (key) => getArrayValue(get(field, key, []));
      }
      // TODO: handle other array types?
      break;

    case fieldTypes.link:
      if (field.linkType === linkTypes.asset) {
        getter = (key) => createAssetHtml(get(field, key));
      } else {
        getter = (key) => get(field, key, '');
      }
      break;

    default:
      break;
  }

  return getter
    ? getTextDiff({
        fieldType,
        oldText: getter('oldValue'),
        newText: getter('currentValue'),
      })
    : '';
};

const getFieldInfo = (id, field) => {
  return (
    <li className="diff-field-wrap" key={id}>
      <label htmlFor="fieldLabel" data-test-id="cdd-field-label">
        {field.label}
      </label>
      {renderFieldDiff(field)}
    </li>
  );
};

const getFieldTables = (fields) => {
  const fieldTable = fields.map((field, index) => getFieldInfo(index, field));
  return fieldTable;
};

const getError = (message) => {
  return (
    <div className="error-message">
      <p>{message}</p>
    </div>
  );
};

export const createEmbeddedRichTextLines = async (field, space, snapshotDate) => {
  // eslint-disable-next-line no-use-before-define
  const rtfLines = await getContentHtmlValue(field, space, snapshotDate, true);

  return `<li class="embedded-rich-text diff-field-wrap">
      <label htmlFor="fieldLabel" 
        data-test-id="cdd-embedded-field-label">
        ${field.label}
      </label>
      ${rtfLines}
    </li>`;
};

export const getEmbeddedEntryValue = async (field, space, snapshotDate, isEmbedded) => {
  let value = '';
  let asset = '';
  switch (field.type) {
    case fieldTypes.richText:
      if (isEmbedded) {
        value = `<li class="embedded-${field.type} diff-field-wrap" key="${field.id}" data-test-id="${entryWrapTestId}">
          <label htmlFor="fieldLabel" data-test-id="cdd-field-label">
            ${field.label} - ID: ${field.contentId}
          </label>
          <div class='diff-level-max diff-field-wrap'><p>Diff level too deep. Content not available.</p></div>
        </li>`;
      } else {
        value = await createEmbeddedRichTextLines(field, space, snapshotDate);
      }
      break;
    case fieldTypes.symbol:
      value = createHtmlForEntry(field);
      break;
    case fieldTypes.text:
      value = createHtmlForEntry(field);
      break;
    case fieldTypes.object:
      // TODO: need to add an object diff tool
      break;
    case fieldTypes.array:
      if (field.arrayType === fieldTypes.symbol) {
        value = createHtmlForArray(field);
      }
      break;

    case fieldTypes.link:
      if (field.arrayType === fieldTypes.symbol) {
        value = createHtmlForArray(field);
      } else {
        asset = await getAsset(field.value.sys.id, space);
        value = createHtmlForAsset(asset);
      }
      break;
    default:
      value = field.value;
  }

  return value;
};

export const createHtmlForEmbeddedEntryLines = async (lines, space, snapshotDate, isEmbedded) => {
  return Promise.all(compact(lines).map(async (line) => getEmbeddedEntryValue(line, space, snapshotDate, isEmbedded)));
};

export const formatEntry = async (line, space, snapshotDate, isEmbedded) => {
  let contentType;
  let result;
  if (isEmbedded) {
    result = ['<div class="diff-level-max diff-field-wrap"><p>Diff level too deep. Content not available.</p></div>'];
    contentType = `Embedded Entry ID: ${line.data.target.sys.id}`;
  } else {
    const entry = await getEntryByDate(space, line.data.target.sys.id, snapshotDate);
    if (!entry) return line;
    const content = await createContentSimpleObjects(space, snapshotDate ? entry.snapshot : entry);

    result = await createHtmlForEmbeddedEntryLines(content, space, snapshotDate, isEmbedded);
    contentType = startCase(get(entry, 'snapshot.sys.contentType.sys.id', get(entry, 'sys.contentType.sys.id', '')));
  }
  const embeddedEntryWrap = `
    <div class="${line.nodeType}" 
      data-test-id="cdd-embedded-entry-wrap">
      <div class='entry-name' 
        data-test-id="cdd-embedded-entry-name" 
        data-entry-id="${get(line, 'data.target.sys.id', '')}">
        ${contentType}
      </div>
      <ul class="field-list-wrap">
  `;

  result.unshift(embeddedEntryWrap);
  result.push('</ul></div>');
  return isArray(result) ? join(result, '') : result;
};

export const createRichTextLines = async (lines, space, snapshotDate, isEmbedded) => {
  const rtfContentLines = await Promise.all(
    lines.map(async (line) => {
      let result;
      let asset;
      const node = line;

      switch (line.nodeType) {
        case richTextFieldTypes.asset:
          asset = await getAsset(line.data.target.sys.id, space);
          result = `<div class="${line.nodeType}" data-test-id="cdd-embedded-asset-block">${createAssetHtml(
            asset
          )}</div>`;
          result = isEmbedded ? result : [result];
          node.formatted = result;
          break;

        case richTextFieldTypes.entry:
          // eslint-disable-next-line no-use-before-define
          node.formatted = await formatEntry(line, space, snapshotDate, isEmbedded);
          break;

        case richTextFieldTypes.paragraph:
          result = await Promise.all(
            line.content.map(async (inlineContent) => {
              const inlineResult = inlineContent;
              if (inlineContent.nodeType === paragraphFieldTypes.inlineEntry) {
                // eslint-disable-next-line no-use-before-define
                inlineResult.formatted = await formatEntry(inlineContent, space, snapshotDate, isEmbedded);
              }
              return Promise.resolve(inlineResult);
            })
          );
          node.content = result;
          break;

        default:
      }

      return Promise.resolve(node);
    })
  );

  return Promise.resolve(rtfContentLines);
};

const formatRichTextNode = (node) => {
  return node.formatted;
};

const parseRichTextToHtml = (document) => {
  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: formatRichTextNode,
      [BLOCKS.EMBEDDED_ENTRY]: formatRichTextNode,
      [INLINES.EMBEDDED_ENTRY]: formatRichTextNode,
    },
  };
  return documentToHtmlString(document, options);
};

const getContentHtmlValue = async (field, space, snapshotDate, isEmbedded) => {
  const fieldValue = field.value;
  const lines = await createRichTextLines(field.value.content, space, snapshotDate, isEmbedded);

  fieldValue.content = lines;
  return parseRichTextToHtml(fieldValue);
};

export const getContent = async (field, space, snapshotDate, snapshot) => {
  const currentRichTextHtml = await getContentHtmlValue(field, space);
  const oldRichTextHtml = await getContentHtmlValue(snapshot, space, snapshotDate);
  const result = {
    currentValue: currentRichTextHtml,
    oldValue: oldRichTextHtml,
  };

  return result;
};

const createDiffField = async (field, snapshots, space, snapshotDate) => {
  const type = getType(field);
  const isRichText = type === fieldTypes.richText;
  const snapshot = head(snapshots.filter((shot) => shot.id === field.id));
  return {
    id: getId(field),
    type,
    label: getLabel(field),
    content: isRichText ? await getContent(field, space, snapshotDate, snapshot) : false,
    currentValue: isRichText ? '' : getValue(field),
    oldValue: isRichText ? '' : getValue(snapshot),
    arrayType: getArrayType(field),
  };
};

export const createDiffFields = async (fields, snapshots, space, snapshotDate) => {
  const diffFields = await Promise.all(fields.map((field) => createDiffField(field, snapshots, space, snapshotDate)));
  return diffFields;
};

export const ContentDiffDialog = ({ sdk }) => {
  const [fields, setFields] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const {
      parameters: {
        invocation: { currentFields, oldFields, snapshotUpdatedAt },
      },
      space,
    } = sdk;

    let diffFields = await createDiffFields(currentFields, oldFields, space, new Date(snapshotUpdatedAt));
    diffFields = addRemovedOldFields(diffFields, oldFields);

    setFields(diffFields);
    setLoading(false);
  }, [sdk]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="loading-message">
        <p>Loading content diffs...</p>
      </div>
    );
  }

  return fields && fields.length > 0 ? (
    <div>
      <ul className="field-list-wrap">{getFieldTables(fields)}</ul>
    </div>
  ) : (
    getError('No fields returned')
  );
};

ContentDiffDialog.propTypes = {
  sdk: PropTypes.shape({
    parameters: PropTypes.shape({
      invocation: PropTypes.shape({
        controls: PropTypes.array.isRequired,
        currentFields: PropTypes.array.isRequired,
        oldFields: PropTypes.array.isRequired,
        snapshotUpdatedAt: PropTypes.string.isRequired,
      }),
    }),
    space: PropTypes.object.isRequired,
  }).isRequired,
};

export { getTextDiff, renderFieldDiff, getFieldInfo, getFieldTables, getArrayValue };

export default ContentDiffDialog;
