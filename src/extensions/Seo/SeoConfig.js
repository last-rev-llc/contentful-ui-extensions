/* eslint-disable react-hooks/exhaustive-deps */
import React, {Component} from 'react';
import { get, set, filter, keys, indexOf, isEmpty, find, head, omit } from 'lodash';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { 
  EmptyState,
  IconButton,
  SelectField,
  Select,
  Option,
  Table,
  TableHead,
  TableBody, 
  TableCell, 
  TableRow,
  TextField} from '@contentful/forma-36-react-components';
import './Seo.scss';

import PropTypes from 'prop-types';


class SeoConfig extends Component {
  constructor (props) {
    super(props);
    this.state = {
      parameters: {
        siteName: '',
        pageTitleDelimiter: '|',
        editorInterface: {}
      },
      contentTypes: [],
      contentTypeConfig: {},
    };
    this.app = this.props.sdk.platformAlpha.app;
    this.app.onConfigure(() => this.onConfigure());
  };


  // eslint-disable-next-line react/sort-comp
  async fetchData() {
    const parameters = await this.app.getParameters();
    const { items: contentTypes } = await this.props.sdk.space.getContentTypes();
    return {
      parameters,
      contentTypes,
    };
  }

  async componentDidMount () {
    const {parameters, contentTypes} = await this.fetchData();
    this.setState(
      {
        parameters,
        contentTypes,
        contentTypeConfig: parameters.editorInterface,
      }, () => this.app.setReady()
    );
  }

  onConfigure () {
    const { parameters, contentTypeConfig } = this.state;
    return {
      parameters: {
        ...parameters,
        editorInterface: contentTypeConfig,
      },
      targetState: {
        EditorInterface: contentTypeConfig,
      }
    };
  }

  handleContentTypeFieldChange = (field) => {
    const { contentTypeConfig } = this.state;

    this.setState({
      contentTypeConfig: {
        ...contentTypeConfig,
        [field.value]: {
          controls: []
        }
      }
    });
  }

  renderContentTypeDropdown = () => {
    const { contentTypes, contentTypeConfig } = this.state;
    const selectedContentTypes = keys(contentTypeConfig);
    const contentTypeDropdownOptions = filter(contentTypes, (ct) => {
      return indexOf(selectedContentTypes, ct.sys.id) === -1;
    });
    return (
      <SelectField className="fieldset"
        labelText="Chose your Content Types to configure SEO"
        onChange={(e) => this.handleContentTypeFieldChange(e.currentTarget)}
        name="contentType"
        id="contentType">
        <Option value="0"
          key="0">Please select a Content Type</Option>
        {contentTypeDropdownOptions.map((contentType) => {
          return (
            <Option value={contentType.sys.id}
              key={contentType.sys.id}>
              {contentType.name}
            </Option>
          );
        })}
      </SelectField>
    );
  }

  handleDefaultFieldChange = (field, contentTypeId) => {
    const { contentTypeConfig } = this.state;

    const fieldConfigToChange = get(contentTypeConfig, `${contentTypeId}.controls`, []);
    const controls = head(fieldConfigToChange) || {};

    console.log('fieldConfigToChange', fieldConfigToChange);
    console.log('controls', controls);
    console.log('field', field);


    this.setState({
      contentTypeConfig: {
        ...contentTypeConfig,
        [contentTypeId]: {
          controls: [set({...controls}, field.name, field.value)]
        }
      }
    });
  }

  renderDefaultFieldConfig = (fieldPath, contentTypeFields, fieldType, contentTypeId) => {
    // return get(contentTypeRowConfig, fieldPath, '');
    const { contentTypeConfig } = this.state;
    const currentValue = get(head(get(contentTypeConfig, `${contentTypeId}.controls`, [])),fieldPath);
    const validFields = filter(contentTypeFields, (field) => {
      if(fieldType === 'Asset' && field.linkType === 'Asset') {
        return true;
      } if (fieldType === field.type) {
        return true;
      }
      return false;
    });

    return (
      <Select className="fieldset"
        onChange={(e) => this.handleDefaultFieldChange(e.currentTarget, contentTypeId)}
        name={fieldPath}
        value={currentValue}>
        <Option value="0"
          key="0">--</Option>
        {validFields.map((field) => {
          return (
            // TODO: Show a link to edit the content type if no valid one exists for the dropdown
            <Option value={field.id}
              key={field.id}>
              {field.name}
            </Option>
          );
        })}
      </Select>
    );
  }

  handleRemoveButton = (contentTypeId) => {
    const { contentTypeConfig } = this.state;
    this.setState({
      contentTypeConfig: omit(contentTypeConfig, contentTypeId),
    });
  }

  renderContentTypeConfigRow = (contentType) => {
    const { contentTypeConfig } = this.state; 
    console.log('contentTypeConfig', contentTypeConfig);
    if(!isEmpty(contentTypeConfig) && get(contentTypeConfig, contentType.sys.id)) {
      // TODO: get teh full content type
      return (
        <TableRow key={Math.random()}>
          <TableCell>
            <IconButton
              iconProps={{
                icon: 'Delete',
              }}
              buttonType="negative"
              label="Delete Row"
              onClick={() => this.handleRemoveButton(contentType.sys.id)}/>
          </TableCell>
          <TableCell>{contentType.name}</TableCell>
          <TableCell>{this.renderDefaultFieldConfig('fieldId', contentType.fields, 'Object', contentType.sys.id)}</TableCell>
          <TableCell>yes/no</TableCell>
          <TableCell>{this.renderDefaultFieldConfig('settings.defaultPageTitleField', contentType.fields, 'Symbol', contentType.sys.id)}</TableCell>
          <TableCell>{this.renderDefaultFieldConfig('settings.defaultDescriptionField', contentType.fields, 'Symbol', contentType.sys.id)}</TableCell>
          <TableCell>{this.renderDefaultFieldConfig('settings.defaultSocialImageField', contentType.fields, 'Asset', contentType.sys.id)}</TableCell>
        </TableRow>
      );
    }

    return null;
  }

  renderContentTypeConfigTable = () => {
    const { contentTypeConfig, contentTypes } = this.state;
    if(isEmpty(contentTypeConfig)) return null;
    return (
      <Table className="fieldset">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Content Type</TableCell>
            <TableCell>SEO Field</TableCell>
            <TableCell>No Index</TableCell>
            <TableCell>Page Title Field</TableCell>
            <TableCell>Description Field</TableCell>
            <TableCell>Image Field</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty(contentTypeConfig) ?
            this.renderContentTypeConfigRow() :
            keys(contentTypeConfig).map((contentTypeId) => {
              return this.renderContentTypeConfigRow(
                find(contentTypes, ['sys.id', contentTypeId])
              );
            })
          }
        </TableBody>

      </Table>
    );
    
  }

  render () {
    const {parameters} = this.state;
    return (
      <div className="seo-config">
        <EmptyState
          className="into"
          headingProps={{ text: 'SEO' }}
          customImageElement={<img src="https://images.ctfassets.net/9o4l1mrd1tci/3ofhr7KXTuiqBhlwkm8h9h/a88289dcfa95fc23a9fcce8418aab94a/lastrev_logo_blk.png"
            alt="" />}
          descriptionProps={{
            text:
            'Fabio vel iudice vincam, sunt in culpa qui officia. Me non paenitet nullum festiviorem excogitasse ad hoc. Cum sociis natoque penatibus et magnis dis parturient.',
          }}/>
        <div className="fields">
          <TextField id="siteName"
            testid="SeoConfig-siteName"
            name="siteName"
            labelText="Site Name"
            helpText="The title of your website that is appended to the end of your page title"
            textInputProps={{
              maxLength: 10,
              onKeyPress: (e) => this.handleFieldChange(e.currentTarget),
              onBlur: (e) => this.handleFieldChange(e.currentTarget),
            }}
            value={get(parameters, 'siteName' || '')}
            countCharacters
            onChange={(e) => this.handleFieldChange(e.currentTarget)}
            onBlur={(e) => this.handleFieldChange(e.currentTarget)} />
        </div>
        {this.renderContentTypeDropdown()}
        {this.renderContentTypeConfigTable()}
      </div>
    );
  }
};


SeoConfig.propTypes = {
  sdk: PropTypes.shape({
    platformAlpha: PropTypes.shape({
      app: PropTypes.shape({
        onConfigure: PropTypes.func.isRequired,
        getParameters: PropTypes.func.isRequired,
        setReady: PropTypes.func.isRequired,
      })
    })
  }).isRequired
};

export default SeoConfig;
