/* eslint-disable react/no-danger */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compact, escape, get, head, isArray, isNil, join, startCase } from 'lodash';
import '@contentful/forma-36-react-components/dist/styles.css';
import diff from 'node-htmldiff';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import './ContentDiff.scss';
import {
  createAssetHtml,
  createHtmlForArray,
  createHtmlForAsset,
  createHtmlForEntry,
  getArrayType,
  getArrayValue,
  getAsset,
  getContentType,
  getEditorInterface,
  getEntry,
  getEntrySnapshots,
  getId,
  getLabel,
  getType,
  getValue,
} from './helpers/index';
import {
  entryWrapTestId,
  fieldTypes,
  firstIndex,
  linkTypes,
  paragraphFieldTypes,
  richTextFieldTypes,
} from './constants';

const getTextDiff = ({ id, oldText, newText, fieldType }) => {
  const changedClass = newText === oldText ? 'no-change' : 'change';

  return (
    <div className="diff-field-line-wrap" key={id} data-field-type={fieldType} data-test-id="cdd-diff-fields">
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

const getFields = (field) => {
  if (isNil(field) || isNil(get(field, 'type'))) return '';
  let result;

  switch (field.type) {
    case fieldTypes.richText:
      result = getTextDiff({
        id: 0,
        oldText: get(field, 'content.oldValue', ''),
        newText: get(field, 'content.currentValue', ''),
        fieldType: field.type,
      });
      break;

    case fieldTypes.symbol:
      result = getTextDiff({
        id: 0,
        oldText: decodeURI(get(field, 'oldValue', '')),
        newText: decodeURI(get(field, 'currentValue', '')),
        fieldType: field.type,
      });
      break;

    case fieldTypes.text:
      result = getTextDiff({
        id: 0,
        oldText: get(field, 'oldValue', ''),
        newText: get(field, 'currentValue', ''),
        fieldType: field.type,
      });
      break;

    case fieldTypes.object:
      // TODO: need to add an object diff tool
      break;

    case fieldTypes.array:
      if (field.arrayType === fieldTypes.symbol) {
        result = getTextDiff({
          id: 0,
          oldText: getArrayValue(get(field, 'oldValue', [])),
          newText: getArrayValue(get(field, 'currentValue', [])),
          fieldType: field.type,
        });
      }
      break;

    case fieldTypes.link:
      if (field.linkType === linkTypes.asset) {
        result = getTextDiff({
          id: 0,
          oldText: createAssetHtml(get(field, 'oldValue')),
          newText: createAssetHtml(get(field, 'currentValue')),
          fieldType: field.type,
        });
      } else {
        result = getTextDiff({
          id: 0,
          oldText: get(field, 'oldValue', ''),
          newText: get(field, 'currentValue', ''),
          fieldType: field.type,
        });
      }

      break;

    default:
      break;
  }
  return result;
};

const getFieldInfo = (id, field) => {
  return (
    <li className="diff-field-wrap" key={id}>
      <label htmlFor="fieldLabel" data-test-id="cdd-field-label">
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

const getError = (message) => {
  return (
    <div className="error-message">
      <p>{message}</p>
    </div>
  );
};

const getEntryByDate = async (space, entryId, snapshotDate) => {
  let entry;
  if (snapshotDate) {
    const snapshots = await getEntrySnapshots(entryId, space);
    entry =
      snapshots &&
      snapshots.items &&
      snapshots.items.filter((item) => new Date(item.sys.updatedAt) <= snapshotDate)[firstIndex];
  } else {
    entry = await getEntry(entryId, space);
  }
  return entry;
};

const createContentSimpleObjects = async (space, entry) => {
  let objects;
  let control;
  if (!entry) return objects;
  const contentType = await getContentType(entry.sys.contentType.sys.id, space);
  const editorInterface = await getEditorInterface(entry.sys.contentType.sys.id, space);
  if (!contentType) return objects;
  const controls = (editorInterface && editorInterface.controls) || [];
  const noValueEntered = {
    nodeType: 'document',
    marks: [],
    content: [
      {
        nodeType: 'paragraph',
        marks: [],
        content: [
          {
            nodeType: 'text',
            marks: [],
            value: '<i>No value entered</i>',
          },
        ],
      },
    ],
  };
  objects = contentType.fields.map((field) => {
    control = field.type === fieldTypes.text && controls.filter((c) => c.fieldId === field.id)[firstIndex];
    return {
      id: field.id,
      contentId: entry.sys.id,
      type: field.type,
      textType: control && control.widgetId,
      value: get(entry, `fields[${field.id}]['en-US']`, noValueEntered),
      arrayType: field.items && field.items.type,
      label: field.name,
    };
  });
  return objects;
};

const createEmbeddedRichTextLines = async (field, space, snapshotDate) => {
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

const getEmbeddedEntryValue = async (field, space, snapshotDate, isEmbedded) => {
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

const createHtmlForEmbeddedEntryLines = async (lines, space, snapshotDate, isEmbedded) => {
  return Promise.all(compact(lines).map(async (line) => getEmbeddedEntryValue(line, space, snapshotDate, isEmbedded)));
};

async function formatEntry(line, space, snapshotDate, isEmbedded) {
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
}

const createRichTextLines = async (lines, space, snapshotDate, isEmbedded) => {
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

const getContent = async (field, space, snapshotDate, snapshot) => {
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

const createDiffFields = async (fields, snapshots, space, snapshotDate) => {
  const diffFields = await Promise.all(fields.map((field) => createDiffField(field, snapshots, space, snapshotDate)));
  return diffFields;
};

const addRemovedOldFields = (fields, snapshots) => {
  snapshots.forEach((shot) => {
    if (fields.every((field) => field.id !== shot.id)) {
      fields.push({
        id: getId(shot),
        type: getType(shot),
        label: getLabel(shot),
        currentValue: false,
        oldValue: getValue(shot),
        arrayType: getArrayType(shot),
      });
    }
  });
  return fields;
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

export { getTextDiff, getFields, getFieldInfo, getFieldTables, getArrayValue };

export default ContentDiffDialog;
