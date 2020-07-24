import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Select, Option } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import './ContentDiff.scss';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { createAssetHtml, getArrayValue } from './helpers/index';

const firstIndex = 0;

const entryWrapTestId = "cdd-entry-wrap";
const entryLabelTestId = "cdd-entry-label";
const entryValueTestId = "cdd-entry-value";
const arrayWrapTestId = "cdd-array-wrap";
const arrayLabelTestId = "cdd-array-label";

let entryLookup = {};
let assetLookup = {};
let snapshotsLookup = {};
let controlsLookup = {};
let contentTypeLookup = {};

const resetLookups = () => {
  entryLookup = {};
  assetLookup = {};
  snapshotsLookup = {};
  controlsLookup = {};
  contentTypeLookup = {};
};

const fieldTypes = {
  richText: 'RichText',
  symbol: 'Symbol',
  object: 'Object',
  array: 'Array',
  link: 'Link',
  text: 'Text'
};

const richTextFieldTypes = {
  asset: 'embedded-asset-block',
  entry: 'embedded-entry-block',
  paragraph: 'paragraph',
};

const paragraphFieldTypes = {
  text: 'text',
  inlineEntry: 'embedded-entry-inline',
  hyperlink: 'hyperlink',
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

const createEmbeddedRichTextLines = async (field, space, snapshotDate) => {
  const rtfLines = await getContentHtmlValue(field, space, snapshotDate, true);
  
  return `<li class="embedded-rich-text diff-field-wrap">
      <label htmlFor="fieldLabel" 
        data-test-id="cdd-embedded-field-label">
        ${field.label}
      </label>
      ${rtfLines}
    </li>`;
};

const getTextValue = (field) => {
  let value = _.escape(field.value).replace("&lt;code&gt;", "<code>").replace("&lt;/code&gt;", "</code>");
  if (field.textType === 'markdown' || field.textType === 'multipleLine' || value.indexOf('<code>') > -1) {
    value = `<pre>${value}</pre>`;
  }
  return value;
};

const getValue = (field) => {
  let value;
  if (field) {
    if (field.type === fieldTypes.symbol || field.type === fieldTypes.text) {
      value = getTextValue(field);
    }
    else {
      value = _.get(field, 'asset', _.get(field, 'value'));
    }
  }
  return value;
};

const createHtmlForEntry = (entry) => {
  return `<li class="embedded-${entry.type} diff-field-wrap" key="${entry.id}" data-test-id="${entryWrapTestId}">
      <label htmlFor="name" data-test-id="${entryLabelTestId}">${entry.label}</label>
      <p data-test-id="${entryValueTestId}">${getValue(entry)}</p>
    </li>`;
};

const createHtmlForAsset = (asset) => {
  if (!asset || _.isUndefined(_.get(asset, 'fields'))) return '';

  return `<li class="embedded-asset diff-field-wrap" key="${asset.sys.id}" data-test-id="${entryWrapTestId}">
      <label htmlFor="name" data-test-id="${entryLabelTestId}">${_.get(asset, "fields.title['en-US']", "No Label")}</label>
      <div data-test-id="${entryValueTestId}"><img src="${_.get(asset, "fields.file['en-US'].url", "Not founds")}" data-test-id="cdd-asset-image"/></div>
    </li>`;
};

const createHtmlForArray = (field) => {
  return `<li class="embedded-${field.type} diff-field-wrap" key="${field.id}" data-test-id="${arrayWrapTestId}">
      <label htmlFor="name" data-test-id="${arrayLabelTestId}">${field.label}</label>
      ${getArrayValue(field)}
    </li>
  `;
};

const addProperty = (json, name, value) => {
  return !json[name] 
    ? {
      ...json,
      [name]: value
    } 
    : json;
};

const getLookupItem = async (lookupItem, get) => {
  let item = lookupItem;
  if (!item) {
    item = await get();
  }
  return item;
};

const getContentType = async (id, space) => {
  const contentType = await getLookupItem(contentTypeLookup[id], () => space.getContentType(id));
  contentTypeLookup = addProperty(contentTypeLookup, id, contentType);
  return contentType;
};

const getEntry = async (id, space) => {
  const entry = await getLookupItem(entryLookup[id], () => space.getEntry(id));
  entryLookup = addProperty(entryLookup, id, entry);
  return entry;
};

const getAsset = async (id, space) => {
  const asset = await getLookupItem(assetLookup[id], () => space.getAsset(id));
  assetLookup = addProperty(assetLookup, id, asset);
  return asset;
};

const getEntrySnapshots = async (id, space) => {
  const snapshots = await getLookupItem(snapshotsLookup[id], () => space.getEntrySnapshots(id));
  snapshotsLookup = addProperty(snapshotsLookup, id, snapshots);
  return snapshots;
};

const getEditorInterface = async (id, space) => {
  const editorInterface = await getLookupItem(controlsLookup[id], () => space.getEditorInterface(id));
  controlsLookup = addProperty(controlsLookup, id, editorInterface);
  return editorInterface;
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
    }
    else {
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
  return Promise.all(_.compact(lines).map(async line => getEmbeddedEntryValue(line, space, snapshotDate, isEmbedded)));
};

const getEntryByDate = async (space, entryId, snapshotDate) => {
  let entry;
  if (snapshotDate) {
    const snapshots = await getEntrySnapshots(entryId, space);
    entry = snapshots && snapshots.items && snapshots.items.filter(item => new Date(item.sys.updatedAt) <= snapshotDate)[firstIndex];
  }
  else {
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
    nodeType: "document", 
    marks: [], 
    content: [{
      nodeType: "paragraph", 
      marks: [], 
      content: [{ 
        nodeType: "text", 
        marks: [], 
        value: "<i>No value entered</i>" 
      }] 
    }]
  };
  objects = contentType.fields.map(field => {
    control = field.type === fieldTypes.text && controls.filter(c => c.fieldId === field.id)[firstIndex];
    return {
      id: field.id,
      contentId: entry.sys.id,
      type: field.type, 
      textType: control && control.widgetId,
      value: _.get(entry, `fields[${field.id}]['en-US']`, noValueEntered),
      arrayType: field.items && field.items.type,
      label: field.name
    };
  });
  return objects;
};

const formatEntry = async (line, space, snapshotDate, isEmbedded) => {
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
    contentType = _.startCase(_.get(entry, 'snapshot.sys.contentType.sys.id', _.get(entry, 'sys.contentType.sys.id', '')));
  }
  const embeddedEntryWrap = `
    <div class="${line.nodeType}" 
      data-test-id="cdd-embedded-entry-wrap">
      <div class='entry-name' 
        data-test-id="cdd-embedded-entry-name" 
        data-entry-id="${_.get(line, 'data.target.sys.id', '')}">
        ${contentType}
      </div>
      <ul class="field-list-wrap">
  `;
  
  result.unshift(embeddedEntryWrap);
  result.push('</ul></div>');
  return _.isArray(result) ? result.join('') : result;
};

const createRichTextLines = async (lines, space, snapshotDate, isEmbedded) => {
  const rtfContentLines = await Promise.all(lines.map(async (line) => {
    let result;
    let asset;
    const node = line;

    switch (line.nodeType) {
    case richTextFieldTypes.asset:
      asset = await getAsset(line.data.target.sys.id, space);
      result = `<div class="${line.nodeType}" data-test-id="cdd-embedded-asset-block">${createAssetHtml(asset)}</div>`;
      result = isEmbedded ? result : [result];
      node.formatted = result;
      break;

    case richTextFieldTypes.entry:
      node.formatted = await formatEntry(line, space, snapshotDate, isEmbedded);
      break;

    case richTextFieldTypes.paragraph:
      result = await Promise.all(line.content.map(async inlineContent => {
        const inlineResult = inlineContent;
        if (inlineContent.nodeType === paragraphFieldTypes.inlineEntry) {
          inlineResult.formatted = await formatEntry(inlineContent, space, snapshotDate, isEmbedded);
        }
        return Promise.resolve(inlineResult);
      }));
      node.content = result;
      break;
        
    default:
    }
    
    return Promise.resolve(node);
  }));
  
  return Promise.resolve(rtfContentLines);
};

const getId = (field) => {
  return field.id;
};

const getType = (field) => {
  return field.type;
};

const getLabel = (field) => {
  return field.label;
};

const getArrayType = (field) => {
  return field.arrayType;
};

const getContent = async (field, space, snapshotDate, snapshot) => {
  const currentRichTextHtml = await getContentHtmlValue(field, space);
  const oldRichTextHtml = await getContentHtmlValue(snapshot, space, snapshotDate);
  const result = {
    currentValue: currentRichTextHtml,
    oldValue: oldRichTextHtml
  };

  return result;
};

const createDiffFields = async (fields, snapshots, space, snapshotDate) => {
  const diffFields = await Promise.all(fields.map(async field => {
    const type = getType(field);
    const isRichText = type === fieldTypes.richText;
    const snapshot = _.head(snapshots.filter(shot => shot.id === field.id));
    return {
      id: getId(field),
      type,
      label: getLabel(field),
      content: isRichText ? await getContent(field, space, snapshotDate, snapshot) : false,
      currentValue: isRichText ? '' : getValue(field),
      oldValue: isRichText ? '' : getValue(snapshot),
      arrayType: getArrayType(field),
    };
  }));
  return diffFields;
};

const addRemovedOldFields = (fields, snapshots) => {
  snapshots.forEach(shot => {
    if (fields.every(field => field.id !== shot.id)) {
      fields.push({
        id: getId(shot),
        type: getType(shot),
        label: getLabel(shot),
        currentValue: false,
        oldValue: getValue(shot),
        arrayType: getArrayType(shot)
      });
    }
  });
  return fields;
};

const createSimpleObjects = async (space, controls, entry, locale) => {
  return Promise.all(controls
    .map(async control => {
      let asset;
      let textType;
      let id = '';
      
      switch (control.field.type) {
      case fieldTypes.link:
        id = locale ? _.get(entry, `[${control.fieldId}]['en-US'].sys.id`) : _.get(entry, `[${control.fieldId}]._fieldLocales['en-US']._value.sys.id`);
        if (!id) break;
        asset = await getAsset(id, space);
        break;
        
      case fieldTypes.text:
        textType = control.widgetId;
        break;

      default:
        break;
      }
      const value = entry[control.fieldId] && (entry[control.fieldId][locale] || entry[control.fieldId].getValue());
      return { 
        id: control.fieldId,
        type: control.field.type, 
        textType,
        value, 
        arrayType: entry[control.fieldId] && entry[control.fieldId].items && entry[control.fieldId].items.type,
        label: control.field.name,
        asset
      };
    }));
};

const getLoading = () => {
  return (
    <div className='loading-message'>
      <p>Loading...</p>
    </div>
  );
};

const getError = message => {
  return (
    <div className='error-message'>
      <p>{message}</p>
    </div>
  );
};

export const ContentDiffSidebar = ({ sdk }) => {
  const [versions, setVersions] = useState([]);
  const [version, setVersion] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    sdk.window.startAutoResizer();
    sdk.space.getEntrySnapshots(sdk.ids.entry)
      .then(snapshots => {
        setVersions(snapshots.items);
        setLoaded(true);
      });
  }, [sdk]);
  
  const refresh = () => {
    resetLookups();
    setLoaded(false);
    sdk.space.getEntrySnapshots(sdk.ids.entry)
      .then(snapshots => {
        setVersions(snapshots.items);
        setLoaded(true);
      });
  };

  const onButtonClick = async () => {
    snapshotsLookup = addProperty(snapshotsLookup, sdk.ids.entry, versions);
    entryLookup = addProperty(entryLookup, sdk.ids.entry, sdk.entry);
    const entry = (version.snapshot && version) || versions[0];
    setVersion(entry);

    const controls = sdk.editor.editorInterface.controls.filter(({ field }) => !field.disabled);
    controlsLookup = addProperty(controlsLookup, sdk.ids.entry, controls);

    const currentFields = await createSimpleObjects(sdk.space, controls, sdk.entry.fields);
    const oldFields = await createSimpleObjects(sdk.space, controls, entry.snapshot.fields, 'en-US');

    let fields = await createDiffFields(currentFields, oldFields, sdk.space, new Date(entry.sys.updatedAt));
    fields = addRemovedOldFields(fields, oldFields);

    await sdk.dialogs.openExtension({
      width: 'fullWidth',
      title: 'Last Rev Content Diff UIE',
      allowHeightOverflow: true,
      parameters: { 
        fields
      },
    });
  };

  const getVersion = event => {
    setVersion(versions.filter(v => v.sys.id === event.currentTarget.value)[firstIndex]);
  };

  const getOptions = options => {
    return options.length > 0 
      ? options.map(option => {
        const updatedAt = new Date(option.sys.updatedAt);
        return (
          <Option
            key={option.sys.id}
            testId={`cf-ui-select-option-${option.sys.id}`}
            value={option.sys.id}>
            {updatedAt.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}&nbsp;
            {updatedAt.toLocaleTimeString('en-us', {hour: '2-digit', minute:'2-digit'})}
          </Option>
        );
      })
      : [<Option />];
  };

  const getDropdownAndButton = () => {
    return (
      <div>
        <Select
          className=""
          id="versionSelect"
          name="versionSelect"
          onChange={(e) => getVersion(e)}
          testId="cf-ui-select-version"
          width="full"
          willBlurOnEsc>
          {getOptions(versions)}
        </Select>
        <Button
          buttonType="positive"
          isFullWidth
          testId="view-changes-button"
          onClick={onButtonClick}>
          View Changes
        </Button>
        <Button
          buttonType="muted"
          isFullWidth
          testId="refresh-button"
          onClick={refresh}>
          Refresh
        </Button>
      </div>
    );
  };

  const getLoadedInfo = () => {
    return versions.length > 0 ? getDropdownAndButton() : getError('No past versions to diff.');
  };

  return loaded ? getLoadedInfo() : getLoading();
};

ContentDiffSidebar.propTypes = {
  sdk: PropTypes.shape({
    window: PropTypes.shape({
      startAutoResizer: PropTypes.func.isRequired
    }),
    space: PropTypes.shape({
      getEntrySnapshots: PropTypes.func.isRequired
    }),
    ids: PropTypes.shape({
      entry: PropTypes.string.isRequired
    }),
    dialogs: PropTypes.shape({
      openExtension: PropTypes.func.isRequired
    }),
    entry: PropTypes.shape({
      fields: PropTypes.object.isRequired
    }),
    editor: PropTypes.shape({
      editorInterface: PropTypes.shape({
        controls: PropTypes.array.isRequired
      })
    })
  }).isRequired
};

export {
  entryWrapTestId,
  entryLabelTestId,
  entryValueTestId,
  arrayWrapTestId,
  arrayLabelTestId,
  resetLookups,
  getEntryByDate,
  createContentSimpleObjects,
  createSimpleObjects,
  getValue,
  createHtmlForEntry,
  createHtmlForArray,
  getEmbeddedEntryValue,
  createHtmlForEmbeddedEntryLines,
  createRichTextLines,
  getId,
  getType,
  getLabel,
  getArrayType,
  getContent,
  createDiffFields,
  addRemovedOldFields,
  getTextValue
};

export default ContentDiffSidebar;

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }