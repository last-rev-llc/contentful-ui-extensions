/* eslint-disable react/static-property-placement */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable max-classes-per-file */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import { Button, Select, Option } from '@contentful/forma-36-react-components';
import { init, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.scss';
import diff from 'node-htmldiff';

const RICH_TEXT = 0;
const SYMBOL = 1;
const OBJECT = 2;
const ARRAY = 3;
const LINK = 4;
const TEXT = 5;

const firstIndex = 0;

const fieldTypes = [
  'RichText',
  'Symbol',
  'Object',
  'Array',
  'Link',
  'Text'
];

const contentfulManagement = require('contentful-management');

const clientManagement = contentfulManagement.createClient({
  accessToken: 'CFPAT-bPHNK075d3bHHJWE1Oc2wgZJXhauhuDNXW9wMXUm7qA'
});

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

const getTextDiffLines = (oldLines, newLines, fieldType) => {
  const oldIsLonger = oldLines.length >= newLines.length;
  const lines = oldIsLonger ? oldLines : newLines;

  return lines.map((line, index) => getTextDiff({ 
    id: index, 
    oldText: oldIsLonger ? line : oldLines[index] || '<blank>', 
    newText: oldIsLonger ? newLines[index] || '<blank>' : line,
    fieldType
  }));
};

const createAssetHtml = (asset) => {
  if (!asset || _.isUndefined(_.get(asset, 'fields'))) return '';

  return `
    <div class='entry-name' data-test-id="cdd-asset-title">${asset.fields.title['en-US']}</div>
      <ul class='field-list-wrap'>
        <li className="diff-field-wrap"><img src="${asset.fields.file['en-US'].url}" data-test-id="cdd-asset-image"/></li>
      </ul>
    </div>
  `;
};

const getFields = (field) => {
  if (_.isNil(field) || _.isNil(_.get(field, 'type'))) return '';
  let result;

  switch (field.type) {
  case fieldTypes[RICH_TEXT]:
    result = getTextDiff({ id: 0, oldText: _.get(field, 'content.oldValue', ''), newText: _.get(field, 'content.currentValue', ''), fieldType: field.type });
    break;
  
  case fieldTypes[SYMBOL]:
    result = getTextDiff({ id: 0, oldText: _.escape(_.get(field, 'oldValue', '')), newText: _.escape(_.get(field, 'currentValue', '')), fieldType: field.type });
    break;

  case fieldTypes[TEXT]:
    result = getTextDiff({ id: 0, oldText: _.get(field, 'oldValue', ''), newText: _.get(field, 'currentValue', ''), fieldType: field.type });
    break;
  
  case fieldTypes[OBJECT]:
    // result = renderTextInfo({ id: 0, oldText: oldFields[field.id]["en-US"], newText: field.value });
    break;
  
  case fieldTypes[ARRAY]:
    if (field.arrayType === fieldTypes[SYMBOL]) {
      result = getTextDiffLines(_.get(field, 'oldValue', []), _.get(field, 'currentValue', []), field.type);
    }
    break;

  case fieldTypes[LINK]:
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

const getEntryByDate = async (environment, entryId, snapshotDate) => {
  const entry = await environment.getEntry(entryId);
  let result = entry;
  if (snapshotDate) {
    const snapshots = await entry.getSnapshots();
    result = snapshots.items.filter(item => new Date(item.sys.updatedAt) <= snapshotDate)[firstIndex];
  }

  return result;
};

// eslint-disable-next-line react/prefer-stateless-function
export class DialogExtension extends React.Component {
  
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <ul className='field-list-wrap'>{getFieldTables(this.props.sdk.parameters.invocation.fields)}</ul>
      </div>
    );
  }
}

const createContentSimpleObjects = async (space, environment, entry) => {
  let objects;
  let control;
  if (!entry) return objects;
  const contentType = await environment.getContentType(entry.sys.contentType.sys.id);
  const editorInterface = await space.getEditorInterface(entry.sys.contentType.sys.id);
  if (!contentType) return objects;
  const controls = (editorInterface && editorInterface.controls) || [];
  objects = contentType.fields.map(field => {
    control = field.type === 'Text' && controls.filter(c => c.fieldId === field.id)[firstIndex];
    return {
      id: field.id,
      type: field.type, 
      textType: control && control.widgetId,
      value: entry.fields[field.id]['en-US'],
      arrayType: field.items && field.items.type,
      label: field.name
    };
  });
  return objects;
};

const createSimpleObjects = async (environment, controls, entry, locale) => {
  return Promise.all(controls
    .map(async control => {
      let asset;
      let textType;
      let id = '';
      switch (control.field.type) {
      case 'Link':
        id = locale ? _.get(entry, `[${control.fieldId}]['en-US'].sys.id`) : _.get(entry, `[${control.fieldId}]._fieldLocales['en-US']._value.sys.id`);
        if (!id) break;
        asset = await environment.getAsset(id);
        break;
      case 'Text':
        textType = control.widgetId;
        break;

      default:
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
    if (field.type === 'Symbol' || field.type === 'Text') {
      value = getTextValue(field);
    }
    else {
      value = _.get(field, 'asset', _.get(field, 'value'));
    }
  }
  return value;
};

const createHtmlForEntry = (entry) => {
  return `
    <li class="embedded-${entry.type} diff-field-wrap" key="${entry.id}" data-test-id="cdd-entry-wrap">
      <label htmlFor="name" data-test-id="cdd-entry-label">${entry.label}</label>
      <span data-test-id="cdd-entry-value">${getValue(entry)}</span>
    </li>
  `;
};

const getArrayValue = (arrayField) => {
  const arrayValues = arrayField.value.map(value => `<li class='array-value' data-test-id="cdd-array-list-item">${value}</li>`).join('');
  return `<ul class='array-field-wrap' data-test-id="cdd-array-list">${arrayValues}</ul>`;
};

const createHtmlForArray = (field) => {
  return `<li class="embedded-${field.type} diff-field-wrap" key="${field.id}" data-test-id="cdd-array-wrap">
      <label htmlFor="name" data-test-id="cdd-array-label">${field.label}</label>
      ${getArrayValue(field)}
    </li>
  `;
};

const getEmbeddedEntryValue = (field) => {
  let value = '';
  switch (field.type) {
  case fieldTypes[RICH_TEXT]:
    // result = renderRichTextLines(field.content);
    break;
  case fieldTypes[SYMBOL]:
    value = createHtmlForEntry(field);
    break;
  case fieldTypes[TEXT]:
    value = createHtmlForEntry(field);
    break;
  case fieldTypes[OBJECT]:
    // value = renderTextInfo({ id: 0, oldText: oldFields[field.id]["en-US"], newText: field.value });
    break;
  case fieldTypes[ARRAY]:
    if (field.arrayType === 'Symbol') {
      value = createHtmlForArray(field);
    }
    break;
  default:
  }
  return value;
};

const createHtmlForEmbeddedEntryLines = (lines) => {
  return _.compact(lines).map(line => getEmbeddedEntryValue(line));
};

const createHtmlForParagraphLines = lines => {
  return _.compact(lines).map(line => {
    if (line.nodeType === 'text') {
      if (line.value.trim() === '') return '';
      return `<p data-test-id="cdd-entry-text">${line.value}</p>`;
    }
    
    return `<div class='embedded-inline-entry'><ul class='field-list-wrap' data-test-id="cdd-embedded-wrap">${createHtmlForEmbeddedEntryLines(line)}</ul></div>`;
  });
};

const createRichTextLines = async (lines, space, environment, snapshotDate) => {
  const rtfContentLines = await Promise.all(lines.map(async (line) => {
    let result;
    let entry;
    let asset;
    let content;
    let contentType;
    
    switch (line.nodeType) {
    case 'embedded-asset-block':
      asset = await environment.getAsset(line.data.target.sys.id);
      result = [`<div class="${line.nodeType}" data-test-id="cdd-embedded-asset-block">${createAssetHtml(asset, line.nodeType)}</div>`];
      break;

    case 'embedded-entry-block':
      entry = await getEntryByDate(environment, line.data.target.sys.id, snapshotDate);
      if (!entry) break;
      
      content = await createContentSimpleObjects(space, environment, snapshotDate ? entry.snapshot : entry);
      result = createHtmlForEmbeddedEntryLines(content);
      
      contentType = _.startCase(_.get(entry, 'sys.contentType.sys.id', ''));
      
      result.unshift(`<div class="${line.nodeType}" data-test-id="cdd-embedded-entry-wrap"><div class='entry-name' data-test-id="cdd-embedded-entry-name">${contentType}</div><ul class="field-list-wrap">`);
      result.push('</ul></div>');
      break;

    case 'paragraph':
      if (line.content.length > 1) {
        content = await Promise.all(line.content.map(async inlineContent => {
          let inlineResult = inlineContent;
          if (inlineContent.nodeType === 'embedded-entry-inline') {
            entry = await getEntryByDate(environment, inlineContent.data.target.sys.id, snapshotDate);
            if (!entry) return Promise.resolve();
            inlineResult = await createContentSimpleObjects(space, environment, snapshotDate ? entry.snapshot : entry);
          }
          return Promise.resolve(inlineResult);
        }));
        result = createHtmlForParagraphLines(content);
      } else {
        result = createHtmlForParagraphLines(line.content);
      }
      break;
        
    default:
    }
    
    return Promise.resolve(result);
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

const getContent = async (field, space, environment, snapshotDate, snapshot) => {
  const currentContent = await createRichTextLines(field.value.content, space, environment);
  const oldContent = await createRichTextLines(snapshot.value.content, space, environment, snapshotDate);
        
  const result = {
    currentValue: _.compact(currentContent).map(content => content.join('')).join(''),
    oldValue: _.compact(oldContent).map(content => content.join('')).join(''),
  };
  return result;
};

const createDiffFields = async (fields, snapshots, space, environment, snapshotDate) => {
  const diffFields = await Promise.all(fields.map(async field => {
    const type = getType(field);
    const isRichText = getType(field) === 'RichText';
    const snapshot = snapshots.filter(shot => shot.id === field.id)[0];
    return {
      id: getId(field),
      type,
      label: getLabel(field),
      content: isRichText ? await getContent(field, space, environment, snapshotDate, snapshot) : false,
      currentValue: isRichText ? '' : getValue(field),
      oldValue: isRichText ? '' : getValue(snapshot),
      arrayType: getArrayType(field),
    };
  }));
  return diffFields;
};

const addRemovedOldFields = async (fields, snapshots) => {
  await Promise.all(snapshots.map(async shot => {
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
    return shot;
  }));
  return fields;
};

export class SidebarExtension extends React.Component {
  space;

  environment;

  version;
  
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  constructor(props){
    super(props);
    this.state = { versions: [] };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.sdk.window.startAutoResizer();
    clientManagement.getSpace(this.props.sdk.ids.space)
      .then(space => {
        this.space = space;
        return space.getEnvironment(this.props.sdk.ids.environment);
      })
      .then(env => {
        this.environment = env;
        return env.getEntry(this.props.sdk.ids.entry);
      })
      .then(entry => entry.getSnapshots())
      .then(snapshots => this._isMounted && this.setState({ versions: snapshots.items }));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onButtonClick = async () => {
    const version = this.version || this.state.versions[0];
    const controls = this.props.sdk.editor.editorInterface.controls.filter(({ field }) => !field.disabled);
    const currentFields = await createSimpleObjects(this.environment, controls, this.props.sdk.entry.fields);
    const oldFields = await createSimpleObjects(this.environment, controls, version.snapshot.fields, 'en-US');
    let fields = await createDiffFields(currentFields, oldFields, this.props.sdk.space, this.environment, new Date(version.sys.updatedAt));
    fields = await addRemovedOldFields(fields, oldFields, this.environment, new Date(version.sys.updatedAt));
    
    await this.props.sdk.dialogs.openExtension({
      width: 'fullWidth',
      title: 'Last Rev Content Diff UIE',
      allowHeightOverflow: true,
      parameters: { 
        fields
      },
    });
  }

  getVersion(event) {
    this.version = this.state.versions.filter(v => v.sys.id === event.currentTarget.value)[firstIndex];
  }

  renderOptions = options => {
    return options.map(option => {
      const updatedAt = new Date(option.sys.updatedAt);
      return (
        <Option
          key={option.sys.id}
          testId="cf-ui-select-option"
          value={option.sys.id}>
          {updatedAt.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}&nbsp;
          {updatedAt.toLocaleTimeString('en-us', {hour: '2-digit', minute:'2-digit'})}
        </Option>
      );
    });
  };

  render() {
    return (
      <div>
        <Select
          className=""
          hasError={false}
          id="optionSelect"
          isDisabled={false}
          name="optionSelect"
          required={false}
          onChange={(e) => this.getVersion(e)}
          testId="cf-ui-select"
          width="full"
          willBlurOnEsc>
          {this.renderOptions(this.state.versions)}
        </Select>
        <Button
          buttonType="positive"
          isFullWidth
          testId="open-dialog"
          onClick={this.onButtonClick}>
          View Changes
        </Button>
      </div>
    );
  }
}

export const initialize = sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(<DialogExtension sdk={sdk} />, document.getElementById('root'));
  } else {
    ReactDOM.render(<SidebarExtension sdk={sdk} />, document.getElementById('root'));
  }
};

init(initialize);

export {
  getTextDiff,
  getTextDiffLines,
  createAssetHtml,
  getFields,
  getFieldInfo,
  getFieldTables,
  getEntryByDate,
  createContentSimpleObjects,
  createSimpleObjects,
  getValue,
  createHtmlForEntry,
  getArrayValue,
  createHtmlForArray,
  getEmbeddedEntryValue,
  createHtmlForEmbeddedEntryLines,
  createHtmlForParagraphLines,
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

export default SidebarExtension;

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }