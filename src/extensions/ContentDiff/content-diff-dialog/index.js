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
import tokens from '@contentful/forma-36-tokens';
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
  accessToken: '<place your api key here>'
});

const renderTextInfo = ({ id, oldText, newText }) => {
  return (
    <div className="diff-field-line-wrap"
      key={id}>
      <div className="diff-field-line-changes"><span dangerouslySetInnerHTML={{__html: oldText}} /></div>
      <div className="diff-field-line-changes"><span dangerouslySetInnerHTML={{__html: diff(oldText, newText)}} /></div>
      <div className="diff-field-line-changes"><span dangerouslySetInnerHTML={{__html: newText}} /></div>
    </div>
  );
};

const renderRichTextLines = (oldLines, newLines, params) => {
  const wrapLines = (lines) => {
    return lines.map(line => {
      switch (line.nodeType) {
      case 'embedded-entry-block':
        // console.log('here');
        // console.log(renderFieldTables(params, true));
        // return `<div class='${line.nodeType}'>${renderFieldTables(params, true)}</div>`;
        console.log(oldLines);
        console.log(params.oldContentRtfFields);
        return `<div class='${line.nodeType}'>${line.data.target.sys.id}</div>`;
      case 'embedded-asset-block':
        return `<div class='${line.nodeType}'>${line.data.target.sys.id}</div>`;
      case 'embedded-entry-inline':
        return `<div class='${line.nodeType}'>${line.data.target.sys.id}</div>`;
      case 'paragraph':
        return `<p class='${line.nodeType}'>${line.content[0].value}</p>`;
      default:
        // console.log(line);
        // console.log(line.nodeType);
        return null; // `<div class='${line.nodeType}'>${line.data.target.sys.id}</div>`;
      }
    }).join('');
  };

  const oldText = wrapLines(oldLines);
  const newText = wrapLines(newLines);

  return renderTextInfo({ 
    id: 10000, 
    oldText,
    newText
  });
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

const renderFields = (field, oldFields, params, isContent) => {
  let result = null;
  let oldFieldValue = '';
  if (!_.isUndefined(oldFields) && _.has(oldFields, `${field.id}['en-US']`)) {
    oldFieldValue = field.type === fieldTypes[RICH_TEXT] ? oldFields[field.id]['en-US'].content : oldFields[field.id]['en-US'];
  } else {
    oldFieldValue = field.type === fieldTypes[RICH_TEXT] ? [] : '';
  };
  // console.log(field);
  // console.log(params.contentRtfFields);
  // console.log('old');
  // console.log(params.oldContentRtfFields);
  switch (field.type) {
  case fieldTypes[RICH_TEXT]:
    if (isContent) {
      result = renderRichTextLines(params.oldContentRtfFields, params.contentRtfFields, params);
    }
    else {
      result = renderRichTextLines(oldFieldValue, field.value.content, params);
    }
    
    break;
  case fieldTypes[SYMBOL]:
    result = renderTextInfo({ id: 0, oldText: oldFieldValue, newText: field.value });
    break;
  case fieldTypes[OBJECT]:
    // result = renderTextInfo({ id: 0, oldText: oldFields[field.id]["en-US"], newText: field.value });
    break;
  case fieldTypes[ARRAY]:
    if (field.arrayType === 'Symbol' && oldFields[field.id]) {
      result = renderTextLines(oldFieldValue, field.value);
    }
    break;
  default:
  }
  return result;
};

const renderFieldInfo = (id, field, oldFields, params, isContent) => {
  return (
    <li className="diff-field-wrap"
      key={id}>
      <FormLabel htmlFor="name">{field.label}</FormLabel>
      {renderFields(field, oldFields, params, isContent)}
    </li>
  );
};

const renderFieldTables = (params, isContent) => {
  const fieldTable = params.fields.map((field, index) => renderFieldInfo(index, field, params.snapshot.snapshot.fields, params, isContent));
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
        <ul className='field-list-wrap'>{renderFieldTables(this.props.sdk.parameters.invocation)}</ul>
      </div>
    );
  }
}

const createSimpleObjects = (contentTypeFields, entry) => {
  return contentTypeFields.filter(type => !type.disabled)
    .map(content => {
      return { 
        id: content.id,
        type: content.type, 
        value: entry[content.id] && entry[content.id].getValue(), 
        arrayType: entry[content.id] && entry[content.id].items && entry[content.id].items.type,
        label: content.name 
      };
    });
};

const tidyContentItemFields = async (environment, contentTypeFields, contentItemFields, snapshotDate) => {
  const allRichTextFieldsContent = createSimpleObjects(contentTypeFields, contentItemFields)
    .filter(field => field.type === fieldTypes[RICH_TEXT])
    .map(rtfField => rtfField.value.content);

  const content = await Promise.all(allRichTextFieldsContent.map(async (rtfContent) => {
    // const rtfFilteredLines = rtfContent.filter(line => line.nodeType === 'embedded-asset-block' || line.nodeType === 'embedded-entry-block');

    const rtfContentLines = await Promise.all(rtfContent.map(async (line) => {
      let result = null;
      
      switch (line.nodeType) {
      case 'embedded-asset-block':
        result = await environment.getAsset(line.data.target.sys.id);
        break;

      case 'embedded-entry-block':
        result = await getEntryByDate(environment, line.data.target.sys.id, snapshotDate);
        break;

      case 'paragraph':
        if (line.content.length > 1) {
          result = await Promise.all(line.content.map(async inlineContent => {
            let inlineResult = inlineContent;
            if (inlineContent.nodeType === 'embedded-entry-inline') {
              inlineResult = await getEntryByDate(environment, inlineContent.data.target.sys.id, snapshotDate);
            }
            return Promise.resolve(inlineResult);
          }));
        }
        break;
          
      default:
        return line;
      }
      return Promise.resolve(result);
    }));

    return rtfContentLines;
  }));

  return content;
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
    const contentRtfFields = await tidyContentItemFields(this.environment, this.props.sdk.contentType.fields, this.props.sdk.entry.fields);
    const oldContentRtfFields = await tidyContentItemFields(this.environment, this.props.sdk.contentType.fields, this.props.sdk.entry.fields, new Date(version.sys.updatedAt));
    // TODO : Get date from dropdown and pull snapshot of main content item.  Function to pull content by id date.
    // console.log('before');
    // console.log(contentRtfFields);
    // console.log(oldContentRtfFields);

    const ct = await this.props.sdk.space.getContentType('justinsEmbeddingTest');
    console.log(ct);

    const result = await this.props.sdk.dialogs.openExtension({
      width: 'fullWidth',
      title: 'Last Rev Content Diff UIE',
      parameters: { 
        fields: createSimpleObjects(this.props.sdk.contentType.fields, this.props.sdk.entry.fields),
        snapshot: this.version || this.state.versions[0],
        contentRtfFields,
        oldContentRtfFields,
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

const getAvailableContentTypes = types => {
  return types.filter(type => !type.disabled);
};

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
