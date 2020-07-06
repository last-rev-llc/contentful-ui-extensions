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

const firstIndex = 0;

const fieldTypes = [
  'RichText',
  'Symbol',
  'Object',
  'Array'
];

const contentfulManagement = require('contentful-management');

const clientManagement = contentfulManagement.createClient({
  accessToken: 'CFPAT-Ioj7yK9qBTJPXaxLsaKG3AhrYimwZZWjIiLlSpJs0PY'
});

const getTextDiff = ({ id, keyId, oldText, newText }) => {
  return (
    <div className="diff-field-line-wrap"
      data-test-id={`cdd-diff-fields-${id}-${keyId}`}
      key={keyId}>
      <div className="diff-field-line-changes"><span data-test-id={`cdd-old-text-${id}-${keyId}`}
        dangerouslySetInnerHTML={{__html: oldText}} /></div>
      <div className="diff-field-line-changes"><span data-test-id={`cdd-diff-text-${id}-${keyId}`}
        dangerouslySetInnerHTML={{__html: diff(oldText, newText)}} /></div>
      <div className="diff-field-line-changes"><span data-test-id={`cdd-new-text-${id}-${keyId}`}
        dangerouslySetInnerHTML={{__html: newText}} /></div>
    </div>
  );
};

const getTextDiffLines = (oldLines, newLines) => {
  const oldIsLonger = oldLines.length >= newLines.length;
  const lines = oldIsLonger ? oldLines : newLines;

  return lines.map((line, index) => getTextDiff({ 
    id: line.id, 
    keyId: index,
    oldText: oldIsLonger ? line : oldLines[index] || '<blank>', 
    newText: oldIsLonger ? newLines[index] || '<blank>' : line
  }));

};

const getFields = (field) => {
  let result = null;
  switch (field.type) {
  case fieldTypes[RICH_TEXT]:
    result = getTextDiff({ id: field.id, keyId: 0, oldText: field.content.oldValue, newText: field.content.currentValue });
    
    break;
  case fieldTypes[SYMBOL]:
    result = getTextDiff({ id: field.id, keyId: 0, oldText: field.oldValue, newText: field.currentValue });
    break;
  case fieldTypes[OBJECT]:
    // result = renderTextInfo({ id: 0, oldText: oldFields[field.id]["en-US"], newText: field.value });
    break;
  case fieldTypes[ARRAY]:
    if (field.arrayType === 'Symbol') {
      result = getTextDiffLines(field.oldValue, field.currentValue);
    }
    break;
  default:
  }
  return result;
};

const getFieldInfo = (id, field) => {
  return (
    <li className="diff-field-wrap"
      key={id}>
      <label htmlFor="fieldLabel">{field.label}</label>
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

const createContentSimpleObjects = async (environment, entry) => {
  let result = null;
  if (entry) {
    const ct = await environment.getContentType(entry.sys.contentType.sys.id);
    result = ct.fields.map(field => ({
      id: field.id,
      type: field.type, 
      value: entry.fields[field.id]['en-US'],
      arrayType: field.items && field.items.type,
      label: field.name
    }));
  }
  return result;
};

const createSimpleObjects = async (environment, contentTypeFields, entry, locale) => {
  return Promise.all(contentTypeFields
    .map(async content => {
      let asset = null;
      let id = '';
      switch (content.type) {
      case 'Link':
        id = locale ? entry[content.id]['en-US'].sys.id : entry[content.id]._fieldLocales['en-US']._value.sys.id;
        asset = await environment.getAsset(id);
        break;

      default:

      }
      const value = entry[content.id] && (entry[content.id][locale] || entry[content.id].getValue());
      return { 
        id: content.id,
        type: content.type, 
        value, 
        arrayType: entry[content.id] && entry[content.id].items && entry[content.id].items.type,
        label: content.name,
        asset
      };
    }));
};

const getValue = (field) => {
  let value = null;

  if (field) {
    value = field.value;
    if (field.type === 'Link') {
      value = field.asset; // TODO get url
    }
  }
  
  return value;
};

const createHtmlForEntry = (entry) => {
  return `
    <li className="diff-field-wrap"
      key="${entry.id}">
      <label htmlFor="name">${entry.label}</label>
      ${getValue(entry)}
    </li>
  `;
};

const getArrayValue = (arrayField) => {
  return arrayField.value.map(value => `<p>${value}</p>`).join('');
};

const createHtmlForArray = (field) => {
  return `
    <li className="diff-field-wrap"
      key="${field.id}">
      <label htmlFor="name">${field.label}</label>
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

const createHtmlForEmbeddedEntry = (line) => {
  return `${getEmbeddedEntryValue(line)}`;
};

const createHtmlForEmbeddedEntryLines = (lines) => {
  return lines.map(line => createHtmlForEmbeddedEntry(line));
};

const createHtmlForEmbeddedInlineEntry = (lines) => {
  return lines.map(line => {
    let html = null;
    if (line.nodeType === 'text') {
      html = `<p>${line.value}</p>`;
    }
    else {
      html = createHtmlForEmbeddedEntry(line);
    }
    return html;
  });
};

const createHtmlForParagraphLines = lines => {
  return lines.map(line => {
    let html = null;
    if (line.nodeType === 'text') {
      html = `<p>${line.value}</p>`;
    }
    else {
      html = createHtmlForEmbeddedInlineEntry(line);
    }
    return html;
  });
};

const createRichTextLines = async (lines, environment, snapshotDate) => {
  const rtfContentLines = await Promise.all(lines.map(async (line) => {
    let result = null;
    let entry = null;
    let asset = null;
    let content = null;
    
    switch (line.nodeType) {
    case 'embedded-asset-block':
      asset = await environment.getAsset(line.data.target.sys.id);
      result = [`<div><img src="${asset.fields.file['en-US'].url}"</div>`];
      break;

    case 'embedded-entry-block':
      entry = await getEntryByDate(environment, line.data.target.sys.id, snapshotDate);
      console.log('embedded-entry-block', entry);
      content = await createContentSimpleObjects(environment, snapshotDate ? entry.snapshot : entry);
      result = createHtmlForEmbeddedEntryLines(content);
      break;

    case 'paragraph':
      if (line.content.length > 1) {
        content = await Promise.all(line.content.map(async inlineContent => {
          let inlineResult = inlineContent;
          if (inlineContent.nodeType === 'embedded-entry-inline') {
            entry = await getEntryByDate(environment, inlineContent.data.target.sys.id, snapshotDate);
            console.log('paragraph', entry);
            inlineResult = await createContentSimpleObjects(environment, snapshotDate ? entry.snapshot : entry);
          }
          return Promise.resolve(inlineResult);
        }));
        result = createHtmlForParagraphLines(content);
      } else {
        result = createHtmlForParagraphLines(line.content);
      }
      break;
        
    default:
      return null;
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

const getContent = async (field, environment, snapshotDate) => {
  const currentContent = await createRichTextLines(field.value.content, environment);
  const oldContent = await createRichTextLines(field.value.content, environment, snapshotDate);
        
  const result = {
    currentValue: currentContent.map(content => content.join('')).join(''),
    oldValue: oldContent.map(content => content.join('')).join(''),
  };
  return result;
};

const createDiffFields = async (fields, snapshots, environment, snapshotDate) => {
  const diffFields = await Promise.all(fields.map(async field => {
    const type = getType(field);
    const isRichText = getType(field) === 'RichText';
    return {
      id: getId(field),
      type,
      label: getLabel(field),
      content: isRichText ? await getContent(field, environment, snapshotDate) : null,
      currentValue: isRichText ? null : getValue(field),
      oldValue: isRichText ? null : getValue(snapshots.filter(shot => shot.id === field.id)[0]),
      arrayType: getArrayType(field),
    };
  }));
  return diffFields;
};

const addRemovedOldFields = async (fields, snapshots, environment, snapshotDate) => {
  const shots = await Promise.all(snapshots.map(async shot => {
    if (fields.every(field => field.id !== shot.id)) {
      fields.push({
        id: getId(shot),
        type: getType(shot),
        label: getLabel(shot),
        currentValue: null,
        oldValue: await getValue(shot, environment, snapshotDate),
        arrayType: getArrayType(shot)
      });
    }
    return shot;
  }));
  return fields;
};

export class SidebarExtension extends React.Component {
  environment = null;

  version = null;
  
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
      .then(space => space.getEnvironment(this.props.sdk.ids.environment))
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
    const currentFields = await createSimpleObjects(this.environment, this.props.sdk.contentType.fields.filter(type => !type.disabled), this.props.sdk.entry.fields);
    const oldFields = await createSimpleObjects(this.environment, this.props.sdk.contentType.fields.filter(type => !type.disabled), version.snapshot.fields, 'en-US');
    let fields = await createDiffFields(currentFields, oldFields, this.environment, new Date(version.sys.updatedAt));
    fields = await addRemovedOldFields(fields, oldFields, this.environment, new Date(version.sys.updatedAt));
    const result = await this.props.sdk.dialogs.openExtension({
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
          Click on me to open dialog extension
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
  createHtmlForEmbeddedEntry,
  createHtmlForEmbeddedEntryLines,
  createHtmlForEmbeddedInlineEntry,
  createHtmlForParagraphLines,
  createRichTextLines,
  getId,
  getType,
  getLabel,
  getArrayType,
  getContent,
  createDiffFields,
  addRemovedOldFields,
};

export default SidebarExtension;

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }