/* eslint-disable react/static-property-placement */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable max-classes-per-file */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import { Button, Select, Option, FormLabel } from '@contentful/forma-36-react-components';
import { init, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.scss';
import diff from 'node-htmldiff';

const RICH_TEXT = 0;
const SYMBOL = 1;
const OBJECT = 2;
const ARRAY = 3;
const LINK = 4;

const firstIndex = 0;

const fieldTypes = [
  'RichText',
  'Symbol',
  'Object',
  'Array',
  'Link',
];

const contentfulManagement = require('contentful-management');

const clientManagement = contentfulManagement.createClient({
  accessToken: 'CFPAT-XH3t9M32kIHGuOPyXlccEgqur2dTP6g_em2-0eGyL88'
});

const renderTextInfo = ({id, oldText, newText, fieldType}) => {
  const changedClass = newText === oldText ? 'no-change' : 'change';
  
  return (
    <div className="diff-field-line-wrap" key={id} data-field-type={fieldType}>
      <div className={`diff-text diff-text_snapshot ${changedClass}`} dangerouslySetInnerHTML={{__html: oldText}} />
      <div className={`diff-text diff-text_changed ${changedClass}`} dangerouslySetInnerHTML={{__html: diff(oldText, newText)}}/>
      <div className={`diff-text diff-text_current ${changedClass}`} dangerouslySetInnerHTML={{__html: newText}}/>
    </div>
  );
};

const renderTextLines = (oldLines, newLines) => {
  const oldIsLonger = oldLines.length >= newLines.length;
  const lines = oldIsLonger ? oldLines : newLines;

  return lines.map((line, index) => renderTextInfo({ 
    id: index, 
    oldText: oldIsLonger ? line : oldLines[index] || '<blank>', 
    newText: oldIsLonger ? newLines[index] || '<blank>' : line
  }));

};

const renderFields = (field) => {
  if (_.isNil(field) || _.isNil(_.get(field, 'type'))) return '';
  let result;

  switch (field.type) {
  case fieldTypes[RICH_TEXT]:
    result = renderTextInfo({ id: 0, oldText: _.get(field, 'content.oldValue', ''), newText: _.get(field, 'content.currentValue', ''), fieldType: field.type });
    break;
  
    case fieldTypes[SYMBOL]:
      result = renderTextInfo({ id: 0, oldText: _.escape(_.get(field, 'oldValue', '')), newText: _.escape(_.get(field, 'currentValue', '')), fieldType: field.type });
      break;
  
    case fieldTypes[OBJECT]:
      // result = renderTextInfo({ id: 0, oldText: oldFields[field.id]["en-US"], newText: field.value });
      break;
  
    case fieldTypes[ARRAY]:
      if (field.arrayType === 'Symbol') {
        result = renderTextLines(_.get(field, 'oldValue', []), _.get(field, 'currentValue', []), field.type);
      }
      break;

    case fieldTypes[LINK]:
      result = renderTextInfo({ id: 0, oldText: createAssetHtml(_.get(field, 'oldValue')), newText: createAssetHtml(_.get(field, 'currentValue')), fieldType: field.type });
      break;
    
    default:
      break;
  }
  return result;
};

const renderFieldInfo = (id, field) => {
  return (
    <li className="diff-field-wrap" key={id}>
      <label htmlFor="fieldLabel">{field.label}</label>
      {renderFields(field)}
    </li>
  );
};

const renderFieldTables = (fields) => {
  const fieldTable = fields.map((field, index) => renderFieldInfo(index, field));
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
      <ul className='field-list-wrap'>{renderFieldTables(this.props.sdk.parameters.invocation.fields)}</ul>
    );
  }
}

const createContentSimpleObjects = async (environment, entry) => {
  if (!entry) return;
  
  const ct = await environment.getContentType(entry.sys.contentType.sys.id);
  return ct.fields.map(field => ({
    id: field.id,
    type: field.type, 
    value: entry.fields[field.id]['en-US'],
    arrayType: field.items && field.items.type,
    label: field.name
  }));
};

const createSimpleObjects = async (environment, contentTypeFields, entry, locale) => {
  return Promise.all(contentTypeFields
    .map(async content => {
      let asset;
      let id = '';
      switch (content.type) {
        case 'Link':
          id = locale ? _.get(entry, `[${content.id}]['en-US'].sys.id`) : _.get(entry, `[${content.id}]._fieldLocales['en-US']._value.sys.id`);
          if (!id) break;
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
  if (!field) return;
  
  return _.get(field, 'asset', _.get(field, 'value'));
};

const createHtmlForEntry = (entry) => {
  return `
    <li class="embedded-${entry.type} diff-field-wrap" key="${entry.id}">
      <label htmlFor="name">${entry.label}</label>
      ${getValue(entry)}
    </li>
  `;
};

const getArrayValue = (arrayField) => {
  const arrayValues = arrayField.value.map(value => `<li class='array-value'>${value}</li>`).join('');
  return `<ul class='array-field-wrap'>${arrayValues}</ul>`;
};

const createHtmlForArray = (field) => {
  return `<li class="embedded-${field.type} diff-field-wrap" key="${field.id}">
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
  return _.compact(lines).map(line => {
    if (line.nodeType === 'text') {
      if (line.value.trim() !== "") return `<p>${line.value}</p>`;
      return '';
    }
    return createHtmlForEmbeddedEntry(line);
  });
};

const createHtmlForParagraphLines = lines => {
  return _.compact(lines).map(line => {
    if (line.nodeType === 'text') {
      if (line.value.trim() === '') return '';
      
      return `<p>test ${line.value}</p>`;
    }
    
    return `<div class='embedded-inline-entry'><ul class='field-list-wrap'>${createHtmlForEmbeddedInlineEntry(line)}</ul></div>`;
  });
};

const createAssetHtml = (asset) => {
  if (!asset || _.isUndefined(_.get(asset, 'fields'))) return '';

  return `
    <div class='entry-name'>${asset.fields.title['en-US']}</div>
      <ul class='field-list-wrap'>
        <li className="diff-field-wrap"><img src="${asset.fields.file['en-US'].url}"/></li>
      </ul>
    </div>
  `;
};

const createRichTextLines = async (lines, environment, snapshotDate) => {
  const rtfContentLines = await Promise.all(lines.map(async (line) => {
    let result;
    let entry;
    let asset;
    let content;
    
    switch (line.nodeType) {
      case 'embedded-asset-block':
        asset = await environment.getAsset(line.data.target.sys.id);
        result = [`<div class="${line.nodeType}">${createAssetHtml(asset, line.nodeType)}</div>`];
        break;

      case 'embedded-entry-block':
        entry = await getEntryByDate(environment, line.data.target.sys.id, snapshotDate);
        if (!entry) break;
        
        content = await createContentSimpleObjects(environment, snapshotDate ? entry.snapshot : entry);
        result = createHtmlForEmbeddedEntryLines(content);
        
        const contentType = _.startCase(_.get(entry, 'sys.contentType.sys.id', ''));
        
        result.unshift(`<div class="${line.nodeType}"><div class='entry-name'>${contentType}</div><ul class="field-list-wrap">`);
        result.push('</ul></div>');
        break;

      case 'paragraph':
        console.log('line', line);
        if (line.content.length > 1) {
          content = await Promise.all(line.content.map(async inlineContent => {
            let inlineResult = inlineContent;
            if (inlineContent.nodeType === 'embedded-entry-inline') {
              entry = await getEntryByDate(environment, inlineContent.data.target.sys.id, snapshotDate);
              if (!entry) return Promise.resolve();
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
        return;
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
  console.log('oldContent', snapshotDate, oldContent);
        
  const result = {
    currentValue: _.compact(currentContent).map(content => content.join('')).join(''),
    oldValue: _.compact(oldContent).map(content => content.join('')).join(''),
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
      content: isRichText ? await getContent(field, environment, snapshotDate) : false,
      currentValue: isRichText ? '' : getValue(field),
      oldValue: isRichText ? '' : getValue(snapshots.filter(shot => shot.id === field.id)[0]),
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
        currentValue: false,
        oldValue: await getValue(shot, environment, snapshotDate),
        arrayType: getArrayType(shot)
      });
    }
    return shot;
  }));
  return fields;
};

export class SidebarExtension extends React.Component {
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
    console.log('oldFields', oldFields)
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

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }