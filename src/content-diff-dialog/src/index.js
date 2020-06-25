import React from 'react';
import PropTypes from 'prop-types';
// import _ from '../../lodash';
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

const fieldTypes = [
  'RichText',
  'Symbol',
  'Object',
  'Array'
];

const contentfulManagement = require('contentful-management');
const clientManagement = contentfulManagement.createClient({
  accessToken: 'CFPAT-ACQ90PPGE2oB9MDZ9Zp_uub3gps_PDmmGjnxlQkv0Qg'
});

const renderTextInfo = ({ id, oldText, newText }) => {
  return (
    <div className="diff-field-line-wrap" key={id}>
      <div className="diff-field-line-changes"><span dangerouslySetInnerHTML={{__html: diff(oldText, newText)}} /></div>
    </div>
  );
};

const renderRichTextLines = (oldLines, newLines, params) => {

  // const asyncRes = await Promise.all(newLines.map(async (line, index) => {
  //   let result = null;
  //   switch (line.nodeType) {
  //     case 'embedded-entry-block':
  //       const space = await clientManagement.getSpace(params.space);
  //       const environment = await space.getEnvironment(params.environment);
  //       const entry = await environment.getEntry(line.data.target.sys.id);
  //       result = await entry.getSnapshots();
  //       break;
      
  //     default:
  //   }
  //   return result;    
  // }));

  //return oldLines.map(line, line.content[0].value)//.map((line, index) => {
  //   switch (line.nodeType) {
  //     case 'embedded-entry-block':
  //       console.log(line.data.target.sys.id);
  //       clientManagement.getSpace(line.space)
  //         .then(space => space.getEnvironment(this.props.sdk.ids.environment))
  //         .then(space => space.getEntry(this.props.sdk.ids.entry))
  //         .then(entry => entry.getSnapshots());
  //   }
  //});
  const oldText = oldLines.map(line => {
    switch (line.nodeType) {
      case 'embedded-entry-block':
        return `<p>Entry Block: ${line.data.target.sys.id}</p>`;
      case 'paragraph':
        return `<p>${line.content[0].value}</p>`;
      default:
        return `<p>Other Block: ${line.data.target.sys.id}</p>`;
        
    }
  }).join('');

  const newText = newLines.map(line => {
    switch (line.nodeType) {
      case 'embedded-entry-block':
        return `<p>Entry Block: ${line.data.target.sys.id}</p>`;
      case 'paragraph':
        return `<p>${line.content[0].value}</p>`;
      default:
        return `<p>Other Block: ${line.data.target.sys.id}</p>`;
        
    }
  }).join('');

  return renderTextInfo({ 
    id: 10000, 
    oldText,
    newText
  });
};

const renderTextLines = (oldLines, newLines) => {
  const oldIsLonger = oldLines.length >= newLines.length
  const lines = oldIsLonger ? oldLines : newLines;

  return lines.map((line, index) => renderTextInfo({ 
    id: index, 
    oldText: oldIsLonger ? line : oldLines[index] || '<blank>', 
    newText: oldIsLonger ? newLines[index] || '<blank>' : line
  }));

};

const renderFields = (field, oldFields, params) => {
  let result = null;
  switch (field.type) {
    case fieldTypes[RICH_TEXT]:
      result = renderRichTextLines(oldFields[field.id]['en-US'].content, field.value.content, params);
      break;
    case fieldTypes[SYMBOL]:
      result = renderTextInfo({ id: 0, oldText: oldFields[field.id]['en-US'], newText: field.value });
      break;
    case fieldTypes[OBJECT]:
      //result = renderTextInfo({ id: 0, oldText: oldFields[field.id]["en-US"], newText: field.value });
      break;
    case fieldTypes[ARRAY]:
      if (field.arrayType === 'Symbol' && oldFields[field.id]) {
        result = renderTextLines(oldFields[field.id]['en-US'], field.value);
      }
      break;
  }
  return result;
}

/*const currentContentFields = [
  { fieldId: "title", fieldValue: "blah" },
  { fieldId: "title2", fieldValue: "bla2" },
  { fieldId: "title3", fieldValue: "blah3" },
];
const currentFieldsObj = _.keyBy(currentContentFields, 'fieldId');
const keyedTest = {
  'title': { fieldId: "title", fieldValue: "blah" },
  'title2': { fieldId: "title2", fieldValue: "bla2" },
  'title3': { fieldId: "title3", fieldValue: "bla3" },
}

keyedTest.title
shapshotKeys.title

const snapshotContentFields = [
  { fieldId: "title", fieldValue: "blah" },
  { fieldId: "title3", fieldValue: "blah3" },
];
*/
const renderFieldInfo = (id, field, oldFields, params) => {
  return (
    <li className="diff-field-wrap" key={id}>
      <FormLabel htmlFor="name">{field.label}</FormLabel>
      {renderFields(field, oldFields, params)}
    </li>
  );
};

const renderFieldTables = (params) => {
  return params.fields.map((field, index) => renderFieldInfo(index, field, params.snapshot.snapshot.fields, params));
};

const getEntrySnapshotByDate = (snapshots, snapshotDate) => {
  // const snapshotVersion = _.find(snapshots, snapshot => snapshot.sys.updatedAt <= snapshotDate);
  // return snapshotVersion;
};

export class DialogExtension extends React.Component {
  constructor(props){
    super(props);
    this.state = { entries: [] };
    this._isMounted = false;
  }

  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  componentDidMount() {
    this._isMounted = true;
    this.props.sdk.window.startAutoResizer();
    clientManagement.getSpace(this.props.sdk.parameters.invocation.space)
      .then(space => space.getEnvironment(this.props.sdk.parameters.invocation.environment))
      .then(env => env.getEntries());
      //.then(entries => console.log(entries));
      // .then(entry => entry.getSnapshots())
      // .then(snapshots => this._isMounted && this.setState({ versions: snapshots.items }));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div style={{ margin: tokens.spacingM }}>
        <ul>
          {renderFieldTables(this.props.sdk.parameters.invocation)}
        </ul>

        <Button
          testId="close-dialog"
          buttonType="muted"
          onClick={() => {
            this.props.sdk.close('dialog data');
          }}>
          Close Modal
        </Button>
      </div>
    );
  }
}

const tidyContentItemFields = async (environment, contentTypeFields, contentItemFields) => {
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
            console.log('asset', result);
            break;

          case 'embedded-entry-block':
            const entry = await environment.getEntry(line.data.target.sys.id);
            const snapshots = await entry.getSnapshots();
            result = snapshots[0]; // TODO - Pull by the date selected in the dropdown
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
  constructor(props){
    super(props);
    this.state = { isMounted: false, versions: [] };
    this._isMounted = false;
  }

  static propTypes = {
    sdk: PropTypes.object.isRequired
  };
  
  environment = null;

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
    const contentRtfFields = await tidyContentItemFields(this.environment, this.props.sdk.contentType.fields, this.props.sdk.entry.fields);
    // TODO : Get date from dropdown and pull snapshot of main content item.  Function to pull content by id date.
    console.log(contentRtfFields);
    const result = await this.props.sdk.dialogs.openExtension({
      width: 'fullWidth',
      title: 'Last Rev Content Diff UIE',
      parameters: { 
        fields: createSimpleObjects(this.props.sdk.contentType.fields, this.props.sdk.entry.fields),
        snapshot: this.version || this.state.versions[0],
        contentRtfFields,
      },
    });
  }

  getVersion(event) {
    this.version = this.state.versions.filter(v => v.sys.id === event.currentTarget.value)[0];
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
          isFullWidth={true}
          testId="open-dialog"
          onClick={this.onButtonClick}>
          Click on me to open dialog extension
        </Button>
      </div>
    );
  }
}

const createSimpleObjects = (contentTypeFields, entry) => {
  return contentTypeFields.filter(type => !type.disabled)
    .map(content => {
      //console.log(content);
      return { 
        id: content.id,
        type: content.type, 
        value: entry[content.id] && entry[content.id].getValue(), 
        arrayType: entry[content.id] && entry[content.id]['items'] && entry[content.id]['items'].type,
        label: content.name 
      };
    });
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
