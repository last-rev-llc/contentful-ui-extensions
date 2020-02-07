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
import SingleAssetWithButton from '../../shared/components/SingleAssetWithButton';



class SeoConfig extends Component {
  constructor (props) {
    super(props);
    const { sdk } = this.props; 
    this.state = {
      parameters: {
        siteName: '',
        defaultSocialImageId: null,
        pageTitleDelimiter: '|',
        editorInterface: {}
      },
      contentTypes: [],
      contentTypeConfig: {},
    };
    this.app = sdk.platformAlpha.app;
    this.app.onConfigure(() => this.onConfigure());
  };


  // eslint-disable-next-line react/sort-comp
  async fetchData() {
    const { sdk } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    const parameters = await this.app.getParameters() || this.state.parameters;
    const { items: contentTypes } = await sdk.space.getContentTypes();
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

  handleGlobalParameterChange = (field) => {
    const { parameters } = this.state;

    this.setState({
      parameters: {
        ...parameters,
        [field.name]: field.value,
      }
    });
  }

  handleDefaultFieldChange = (field, contentTypeId) => {
    const { contentTypeConfig } = this.state;

    const fieldConfigToChange = get(contentTypeConfig, `${contentTypeId}.controls`, []);
    const controls = head(fieldConfigToChange) || {};
    let newControlsValue = [set({...controls}, field.name, field.value)];
    if(field.value === '0') {
      newControlsValue = [omit({...controls}, field.name)];
    }

    this.setState({
      contentTypeConfig: {
        ...contentTypeConfig,
        [contentTypeId]: {
          controls: newControlsValue
        }
      }
    });
  }

  handleDefaultImageChange = (contentfulAsset) => {
    const { parameters } = this.state;
    if(contentfulAsset && get(contentfulAsset, 'sys.id')) {
      this.setState({
        parameters: {
          ...parameters,
          defaultSocialImageId: get(contentfulAsset, 'sys.id'),
        }
      });
    }
  }

  handleRemoveDefaultImage = () => {
    const { parameters } = this.state;
    this.setState({
      parameters: {
        ...parameters,
        defaultSocialImageId: null,
      }
    });
  }

  renderDefaultFieldConfig = (fieldPath, contentTypeFields, fieldType, contentTypeId) => {
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

  renderRobotsSelectList = (fieldPath, contentTypeId) => {
    const { contentTypeConfig } = this.state;
    // Find the current state if any
    const currentValue = get(head(get(contentTypeConfig, `${contentTypeId}.controls`, [])),fieldPath);
    return (
      <Select className="fieldset"
        onChange={(e) => this.handleDefaultFieldChange(e.currentTarget, contentTypeId)}
        name={fieldPath}
        value={currentValue}
        testId="SeoConfig-select-defaultNoIndex">
        <Option value="index,follow"
          key="index,follow"
          testId="SeoConfig-option-defaultNoIndex">Yes</Option>
        <Option value="noindex,nofollow"
          key="noindex,nofollow"
          testId="SeoConfig-option-defaultNoIndex">No</Option>
      </Select>
    );
  }

  renderContentTypeConfigRow = (contentType) => {
    const { contentTypeConfig } = this.state; 
    if(contentType && !isEmpty(contentTypeConfig) && get(contentTypeConfig, contentType.sys.id)) {
      // TODO: get the full content type
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
          <TableCell testId="SeoConfig-tablecell-contentType-noindex">{this.renderRobotsSelectList('settings.defaultNoIndex', contentType.sys.id)}</TableCell>
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

  render () {
    const { sdk } = this.props;
    const { parameters } = this.state;
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
              onKeyPress: (e) => this.handleGlobalParameterChange(e.currentTarget),
              onBlur: (e) => this.handleGlobalParameterChange(e.currentTarget),
            }}
            value={parameters.siteName || ''}
            countCharacters />
          <Select className="fieldset"
            onChange={(e) => this.handleGlobalParameterChange(e.currentTarget)}
            name="pageTitleDelimiter"
            value={parameters.pageTitleDelimiter || '|'}
            testId="SeoConfig-select-pageTitleDelimiter">
            <Option value="|"
              key="|"
              testId="SeoConfig-option-pageTitleDelimiter">|</Option>
            <Option value="/"
              key="/"
              testId="SeoConfig-option-pageTitleDelimiter">/</Option>
            <Option value=">"
              key=">"
              testId="SeoConfig-option-pageTitleDelimiter">&gt;</Option>
          </Select>
          <SingleAssetWithButton sdk={sdk}
            assetId={parameters.defaultSocialImageId}
            handleFieldChange={(asset) => this.handleDefaultImageChange(asset)} 
            handleRemoveImage={() => this.handleRemoveDefaultImage()}
            handleChangeImage={(asset) => this.handleDefaultImageChange(asset)}/>
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
    }),
    space: PropTypes.shape({
      getContentTypes: PropTypes.func.isRequired,
    })
  }).isRequired
};

export default SeoConfig;
