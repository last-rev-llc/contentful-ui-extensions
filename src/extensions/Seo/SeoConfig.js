import React, {Component }from 'react';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { 
  Heading,
  Note,
  Form,
  SelectField,
  Option,
  Table,
  TableHead,
  TableBody, 
  TableCell, 
  TableRow} from '@contentful/forma-36-react-components';

import PropTypes from 'prop-types';


class SeoConfig extends Component {
  constructor (props) {
    super(props);
    this.state = {
      parameters: {},
      contentTypes: [],
      appConfig: {},
    };
    console.log('hello initiate');
    this.app = this.props.sdk.platformAlpha.app;
  }

  async getConfigData () {
    const parameters = await this.app.getParameters() || {};
    const { items: contentTypes } = await this.props.sdk.space.getContentTypes();
    return {
      parameters,
      contentTypes,
    };
  }
  
  async componentDidMount () {
    const configData = await this.getConfigData();
    this.setState(
      configData,
      () => this.app.setReady()
    );
  }

  async onConfigure () {
    const { items: contentTypes } = await this.props.sdk.space.getContentTypes();
    const contentTypeIds = contentTypes.map(ct => ct.sys.id);

    return {
      parameters: this.state.parameters,
      targetState: {
        EditorInterface: contentTypeIds.reduce((acc, id) => {
          return { ...acc, [id]: { sidebar: { position: 0 } } };
        }, {})
      }
    };
  }

  renderContentConfig = () => {
    const { contentTypes } = this.state;
    if(!contentTypes) return null;
    console.log(contentTypes);
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Content Type</TableCell>
            <TableCell>Page Title Field</TableCell>
            <TableCell>Description Field</TableCell>
            <TableCell>Image Field</TableCell>
            <TableCell>NoIndex</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {contentTypes.map((ct) => {
            return (
              <TableRow key={ct.sys.id}
                data-contentTypeId={ct.sys.id}>
                <TableCell>{ct.name}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  render () {
    return (
      <Form id="app-config">
        <Heading>{this.renderContentConfig()}</Heading>
        <Note noteType="primary"
          title="About the app">
          Make editors in this space a little bit happier with a cute animal picture in the entry editor sidebar.
        </Note>
        <SelectField
          required
          name="animal-selection"
          id="animal-selection"
          labelText="Animal"
          value="cats"
          onChange={e => this.setState({ parameters: { animal: e.target.value } })}>
          <Option value="cat">Cat</Option>
          <Option value="dog">Dog</Option>
          <Option value="owl">Owl</Option>
        </SelectField>
      </Form>
    );
  }
}

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
