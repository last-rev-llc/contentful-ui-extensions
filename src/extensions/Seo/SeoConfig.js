/* eslint-disable react-hooks/exhaustive-deps */
import React, {Component} from 'react';
import { get, set, filter, keys, indexOf, isEmpty, find, head, omit } from 'lodash';
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
    // eslint-disable-next-line react/destructuring-assignment
    const parameters = await this.app.getParameters() || this.state.parameters;
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
        contentTypeConfig: get(parameters, 'editorInterface'),
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
        id="contentType"
        testId="SeoConfig-select-contentType">
        <Option value="0"
          key="0">Please select a Content Type</Option>
        {contentTypeDropdownOptions.map((contentType) => {
          return (
            <Option value={contentType.sys.id}
              key={contentType.sys.id}
              testId="SeoConfig-option-contentType">
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

    // console.log('fieldConfigToChange', fieldConfigToChange);
    // console.log('controls', controls);
    // console.log('field', field);


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
        value={currentValue}
        testId="SeoConfig-select-fields">
        <Option value="0"
          key="0"
          testId="SeoConfig-option-fields-default">--</Option>
        {validFields.map((field) => {
          return (
            // TODO: Show a link to edit the content type if no valid one exists for the dropdown
            <Option value={field.id}
              key={field.id}
              testId="SeoConfig-option-fields">
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
    if(!isEmpty(contentTypeConfig) && get(contentTypeConfig, contentType.sys.id)) {
      // TODO: get teh full content type
      return (
        <TableRow key={Math.random()}
          testId="SeoConfig-tablerow-contentType">
          <TableCell>
            <IconButton
              iconProps={{
                icon: 'Delete',
              }}
              buttonType="negative"
              label="Delete Row"
              onClick={() => this.handleRemoveButton(contentType.sys.id)}
              testId="SeoConfig-button-contentType-delete"/>
          </TableCell>
          <TableCell testId="SeoConfig-tablecell-contentType-name">{contentType.name}</TableCell>
          <TableCell testId="SeoConfig-tablecell-contentType-seo">{this.renderDefaultFieldConfig('fieldId', contentType.fields, 'Object', contentType.sys.id)}</TableCell>
          <TableCell testId="SeoConfig-tablecell-contentType-noindex">yes/no</TableCell>
          <TableCell testId="SeoConfig-tablecell-contentType-defaultPageTitleField">{this.renderDefaultFieldConfig('settings.defaultPageTitleField', contentType.fields, 'Symbol', contentType.sys.id)}</TableCell>
          <TableCell testId="SeoConfig-tablecell-contentType-defaultDescriptionField">{this.renderDefaultFieldConfig('settings.defaultDescriptionField', contentType.fields, 'Symbol', contentType.sys.id)}</TableCell>
          <TableCell testId="SeoConfig-tablecell-contentType-defaultSocialImageField">{this.renderDefaultFieldConfig('settings.defaultSocialImageField', contentType.fields, 'Asset', contentType.sys.id)}</TableCell>
        </TableRow>
      );
    }

    return null;
  }

  renderContentTypeConfigTable = () => {
    const { contentTypeConfig, contentTypes } = this.state;
    if(isEmpty(contentTypeConfig)) return null;
    return (
      <Table className="fieldset"
        testId="SeoConfig-table-contentType">
        <TableHead>
          <TableRow testId="SeoConfig-tablehead-contentType">
            <TableCell testId="SeoConfig-tablehead-contentType-delete"/>
            <TableCell testId="SeoConfig-tablehead-contentType-name">Content Type</TableCell>
            <TableCell testId="SeoConfig-tablehead-contentType-seo">SEO Field</TableCell>
            <TableCell testId="SeoConfig-tablehead-contentType-noindex">No Index</TableCell>
            <TableCell testId="SeoConfig-tablehead-contentType-defaultPageTitleField">Page Title Field</TableCell>
            <TableCell testId="SeoConfig-tablehead-contentType-defaultDescriptionField">Description Field</TableCell>
            <TableCell testId="SeoConfig-tablehead-contentType-defaultSocialImageField">Image Field</TableCell>
          </TableRow>
        </TableHead>
        <TableBody testId="SeoConfig-tablebody-contentType">
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

  handleFieldChange = (field) => {

  };

  render () {
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
          }}
          testId="SeoConfig-intro"/>
        <div className="fields">
          <TextField id="siteName"
            name="siteName"
            labelText="Site Name"
            helpText="The title of your website that is appended to the end of your page title"
            textInputProps={{
              testId: "SeoConfig-siteName",
              maxLength: 10,
              onKeyPress: (e) => this.handleDefaultFieldChange(e.currentTarget),
              onBlur: (e) => this.handleDefaultFieldChange(e.currentTarget),
            }}
            value={this.state.parameters.siteName || ''}
            countCharacters
            onChange={(e) => this.handleDefaultFieldChange(e.currentTarget)}
            onBlur={(e) => this.handleDefaultFieldChange(e.currentTarget)} />
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
