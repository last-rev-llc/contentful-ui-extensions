/* eslint-disable react-hooks/exhaustive-deps */
import React, {Component} from 'react';
import { get } from 'lodash';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { 
  EmptyState,
  Button,
  // Heading,
  // Note,
  // Form,
  // SelectField,
  // Option,
  // Table,
  // TableHead,
  // TableBody, 
  // TableCell, 
  // TableRow,
  TextField} from '@contentful/forma-36-react-components';
import './Seo.scss';

import PropTypes from 'prop-types';


class SeoConfig extends Component {
  constructor (props) {
    super(props);
    this.state = { parameters: {}, contentTypes: [] };
    this.app = this.props.sdk.platformAlpha.app;
    this.app.onConfigure(() => this.onConfigure());
  }

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
      }, () => this.app.setReady()
    );
  }

  onConfigure () {
    const { parameters } = this.state;
    return {
      parameters,
      targetState: {
        EditorInterface: {
          seoApp: {
            controls: [
              {fieldId: 'seo'},
            ]
          }
        }
      }
    };
  }


  handleFieldChange = (field) => {
    const { parameters } = this.state;
    this.setState({
      parameters: {
        ...parameters,
        [field.name]: field.value,
      }
    });
  };

  

  render () {
    const {parameters} = this.state;
    console.log('render state', this.state);
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
          <Button onClick={() => this.app.onConfigure()}>Save</Button>
        </div>
        {/* console.log('appParameters state', parameters) */}
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
