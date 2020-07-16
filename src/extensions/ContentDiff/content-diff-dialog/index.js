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

const firstIndex = 0;

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
  paragraph: 'paragraph'
};

const paragraphFieldTypes = {
  text: 'text',
  inlineEntry: 'embedded-entry-inline',
  hyperlink: 'hyperlink',
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

  return `<div class='entry-name' data-test-id="cdd-asset-title">${asset.fields.title['en-US']}</div>
      <ul class='field-list-wrap'>
        <li className="diff-field-wrap"><img src="${asset.fields.file['en-US'].url}" data-test-id="cdd-asset-image"/></li>
      </ul>
    </div>`;
};

const getArrayValue = (arrayField) => {
  const values = _.isArray(arrayField) ? arrayField : _.get(arrayField, 'value', []);
  if (!values.length) return '';
  const arrayValues = values.map(value => `<li class='array-value' data-test-id="cdd-array-list-item">${value}</li>`).join('');
  return `<ul class='array-field-wrap' data-test-id="cdd-array-list">${arrayValues}</ul>`;
};

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
      // result = getTextDiffLines(_.get(field, 'oldValue', []), _.get(field, 'currentValue', []), field.type);
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

const getEntryByDate = async (space, entryId, snapshotDate) => {
  return snapshotDate 
    ? ((await space.getEntrySnapshots(entryId)).items || []).filter(item => new Date(item.sys.updatedAt) <= snapshotDate)[firstIndex] 
    : space.getEntry(entryId);
};

const getLoading = () => {
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

const getError = message => {
  return (
    <div>
      <h4>{message}</h4>
    </div>
  );
};

// eslint-disable-next-line react/prefer-stateless-function
export class DialogExtension extends React.Component {
  
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  render() {
    // this.props.sdk.parameters.invocation.fields = [];  // uncomment to check no fields

    return this.props.sdk.parameters.invocation.fields.length > 0 
      ? (
        <div>
          <ul className='field-list-wrap'>{getFieldTables(this.props.sdk.parameters.invocation.fields)}</ul>
        </div>
      )
      : getError('No fields returned');
  }
}

const createContentSimpleObjects = async (space, entry) => {
  let objects;
  let control;
  if (!entry) return objects;
  const contentType = await space.getContentType(entry.sys.contentType.sys.id);
  const editorInterface = await space.getEditorInterface(entry.sys.contentType.sys.id);
  if (!contentType) return objects;
  const controls = (editorInterface && editorInterface.controls) || [];
  objects = contentType.fields.map(field => {
    control = field.type === fieldTypes.text && controls.filter(c => c.fieldId === field.id)[firstIndex];
    return {
      id: field.id,
      contentId: entry.sys.id,
      type: field.type, 
      textType: control && control.widgetId,
      value: _.get(entry, `fields[${field.id}]['en-US']`, { content: [{ nodeType: "paragraph", content: [{ nodeType: "text", value: "<i class='blank-value'>No value entered</i>" }] }]}),
      arrayType: field.items && field.items.type,
      label: field.name
    };
  });
  return objects;
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
        asset = await space.getAsset(id);
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
  return `<li class="embedded-${entry.type} diff-field-wrap" key="${entry.id}" data-test-id="cdd-entry-wrap">
      <label htmlFor="name" data-test-id="cdd-entry-label">${entry.label}</label>
      <p data-test-id="cdd-entry-value">${getValue(entry)}</p>
    </li>`;
};

const createHtmlForAsset = (asset) => {
  if (!asset || _.isUndefined(_.get(asset, 'fields'))) return '';

  return `<li class="embedded-asset diff-field-wrap" key="${asset.sys.id}" data-test-id="cdd-entry-wrap">
      <label htmlFor="name" data-test-id="cdd-entry-label">${_.get(asset, "fields.title['en-US']", "No Label")}</label>
      <div data-test-id="cdd-entry-value"><img src="${_.get(asset, "fields.file['en-US'].url", "Not founds")}" data-test-id="cdd-asset-image"/></div>
    </li>`;
};

const createHtmlForArray = (field) => {
  return `<li class="embedded-${field.type} diff-field-wrap" key="${field.id}" data-test-id="cdd-array-wrap">
      <label htmlFor="name" data-test-id="cdd-array-label">${field.label}</label>
      ${getArrayValue(field)}
    </li>
  `;
};

const createEmbeddedRichTextLines = async (field, space, snapshotDate) => {
  const lines = await createRichTextLines(field.value.content, space, snapshotDate, true);
  
  return `<li class="embedded-rich-text diff-field-wrap">
      <label htmlFor="fieldLabel" 
        data-test-id="cdd-embedded-field-label">
        ${field.label}
      </label>
      ${lines.join('')}
    </li>`;
};

const getEmbeddedEntryValue = async (field, space, snapshotDate, isEmbedded) => {
  let value = '';
  let asset = '';
  switch (field.type) {
  case fieldTypes.richText:
    if (isEmbedded) {
      value = `<li class="embedded-${field.type} diff-field-wrap" key="${field.id}" data-test-id="cdd-entry-wrap">
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
    // value = renderTextInfo({ id: 0, oldText: oldFields[field.id]["en-US"], newText: field.value });
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
      asset = await space.getAsset(field.value.sys.id);
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

const createHtmlForParagraphLines = async (lines, space, snapshotDate, isEmbedded) => {
  return Promise.all(_.compact(lines).map(async line => {
    if (line.nodeType === paragraphFieldTypes.text) {
      if (line.value.trim() === '') return '';
      return `<p data-test-id="cdd-entry-text">${line.value}</p>`;
    } if (line.nodeType === paragraphFieldTypes.hyperlink) {
      if (!_.has(line, 'data.uri') || !_.has(line, 'content[0].value')) return '';
      return `<a data-test-id="cdd-entry-hyperlink" href="${_.get(line, 'data.uri')}">${_.get(line, 'content[0].value')}</a>`;
    }
    let paragraphLines = await createHtmlForEmbeddedEntryLines(line, space, snapshotDate, isEmbedded);
    paragraphLines = isEmbedded ? paragraphLines.join('') : paragraphLines;
    return `<div class='embedded-inline-entry'><ul class='field-list-wrap' data-test-id="cdd-embedded-wrap">${paragraphLines}</ul></div>`;
  }));
};

const createRichTextLines = async (lines, space, snapshotDate, isEmbedded) => {
  const rtfContentLines = await Promise.all(lines.map(async (line) => {
    let result;
    let entry;
    let asset;
    let content;
    let contentType;

    switch (line.nodeType) {
    case richTextFieldTypes.asset:
      asset = await space.getAsset(line.data.target.sys.id);
      result = `<div class="${line.nodeType}" data-test-id="cdd-embedded-asset-block">${createAssetHtml(asset, line.nodeType)}</div>`;
      result = isEmbedded ? result : [result];
      break;

    case richTextFieldTypes.entry:
      if (isEmbedded) {
        result = ['<div class="diff-level-max diff-field-wrap"><p>Diff level too deep. Content not available.</p></div>'];
        contentType = `Embedded Entry ID: ${line.data.target.sys.id}`;
      } else {
        entry = await getEntryByDate(space, line.data.target.sys.id, snapshotDate);
        if (!entry) break;
        content = await createContentSimpleObjects(space, snapshotDate ? entry.snapshot : entry);
        
        result = await createHtmlForEmbeddedEntryLines(content, space, snapshotDate, isEmbedded);
        contentType = _.startCase(_.get(entry, 'snapshot.sys.contentType.sys.id', _.get(entry, 'sys.contentType.sys.id', '')));
      }
      
      result.unshift(`<div class="${line.nodeType}" data-test-id="cdd-embedded-entry-wrap"><div class='entry-name' data-test-id="cdd-embedded-entry-name" data-entry-id="${_.get(line, 'data.target.sys.id', '')}">${contentType}</div><ul class="field-list-wrap">`);
      result.push('</ul></div>');
      result = _.isArray(result) ? result.join('') : result;
      break;

    case richTextFieldTypes.paragraph:
      if (line.content.length > 1) {
        content = await Promise.all(line.content.map(async inlineContent => {
          let inlineResult = inlineContent;
          
          if (inlineContent.nodeType === paragraphFieldTypes.inlineEntry) {
            entry = await getEntryByDate(space, inlineContent.data.target.sys.id, snapshotDate);
            if (!entry) return Promise.resolve();
            inlineResult = await createContentSimpleObjects(space, snapshotDate ? entry.snapshot : entry);
          }
          return Promise.resolve(inlineResult);
        }));
        result = await createHtmlForParagraphLines(content, space, snapshotDate, isEmbedded);
      } else {
        result = await createHtmlForParagraphLines(line.content, space, snapshotDate, isEmbedded);
      }
      result = isEmbedded ? result.join('') : result;
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

const getContent = async (field, space, snapshotDate, snapshot) => {
  const currentContent = await createRichTextLines(field.value.content, space);
  const oldContent = await createRichTextLines(snapshot.value.content, space, snapshotDate);
        
  const result = {
    currentValue: _.compact(currentContent).map(content => _.isArray(content) ? content.join('') : content).join(''),
    oldValue: _.compact(oldContent).map(content =>  _.isArray(content) ? content.join('') : content).join(''),
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

export class SidebarExtension extends React.Component {
  version;
  
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  constructor(props){
    super(props);
    this.state = { versions: [], loaded: false };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.sdk.window.startAutoResizer();
    this.props.sdk.space.getEntrySnapshots(this.props.sdk.ids.entry)
    //  .then(() => this._isMounted && this.setState({ versions: [], loaded: true }));  // uncomment to check no versions
      .then(snapshots => this._isMounted && this.setState({ versions: snapshots.items, loaded: true })); // comment to check no versions
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onButtonClick = async () => {
    const version = this.version || this.state.versions[0];
    const controls = this.props.sdk.editor.editorInterface.controls.filter(({ field }) => !field.disabled);
    const currentFields = await createSimpleObjects(this.props.sdk.space, controls, this.props.sdk.entry.fields);
    const oldFields = await createSimpleObjects(this.props.sdk.space, controls, version.snapshot.fields, 'en-US');
    let fields = await createDiffFields(currentFields, oldFields, this.props.sdk.space, new Date(version.sys.updatedAt));
    fields = addRemovedOldFields(fields, oldFields);
    
    await this.props.sdk.dialogs.openExtension({
      width: 'fullWidth',
      title: 'Last Rev Content Diff UIE',
      allowHeightOverflow: true,
      parameters: { 
        fields
      },
    });
  }

  getDropdownAndButton() {
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
          {this.getOptions(this.state.versions)}
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

  getLoadedInfo() {
    return this.state.versions.length > 0 ? this.getDropdownAndButton() : getError('No versions returned');
  }

  getVersion(event) {
    this.version = this.state.versions.filter(v => v.sys.id === event.currentTarget.value)[firstIndex];
  }

  getOptions = options => {
    return options.length > 0 
      ? options.map(option => {
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
      })
      : [<Option />];
  };

  render() {
    return this.state.loaded ? this.getLoadedInfo() : getLoading();
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