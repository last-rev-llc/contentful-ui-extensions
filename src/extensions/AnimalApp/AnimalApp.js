import React, { Component } from 'react';

import { locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { Heading, Note, Form, SelectField, Option } from '@contentful/forma-36-react-components';

const DEFAULT_ANIMAL = 'cat';

class Config extends Component {
  constructor (props) {
    console.log('Hello config component');
    super(props);
    this.state = { parameters: {} };
    this.app = this.props.sdk.platformAlpha.app;
    this.app.onConfigure(() => this.onConfigure());
  }
  
  async componentDidMount () {
    const parameters = await this.app.getParameters();
    this.setState(
      { parameters: parameters || {} },
      () => this.app.setReady()
    );
  }
  
  

  async onConfigure () {
    console.log('state', this.state);
    // const { items: contentTypes } = await this.props.sdk.space.getContentTypes();
    // const contentTypeIds = contentTypes.map(ct => ct.sys.id);

    // return {
    //   parameters: this.state.parameters,
    //   targetState: {
    //     EditorInterface: contentTypeIds.reduce((acc, id) => {
    //       return { ...acc, [id]: { sidebar: { position: 0 } } };
    //     }, {})
    //   }
    // };
  }

  render () {
    return (
      <Form id="app-config">
        <Heading>Daily Animal app</Heading>
        <Note noteType="primary"
          title="About the app">
          Make editors in this space a little bit happier with a cute animal picture in the entry editor sidebar.
        </Note>
        <SelectField
          required
          name="animal-selection"
          id="animal-selection"
          labelText="Animal"
          value={this.state.parameters.animal || DEFAULT_ANIMAL}
          onChange={e => this.setState({ parameters: { animal: e.target.value } })}>
          <Option value={DEFAULT_ANIMAL}>Cat</Option>
          <Option value="dog">Dog</Option>
          <Option value="owl">Owl</Option>
          {console.log('state render', this.state)}
        </SelectField>
      </Form>
    );
  }
}

function AnimalPicture ({ sdk }) {
  const animal = sdk.parameters.installation.animal || DEFAULT_ANIMAL;
  const src = `https://source.unsplash.com/250x250/?${animal}`;
  
  return <img alt={animal}
    id="animal-picture"
    src={src} />;
}

const AnimalApp = ({sdk}) => {
  const NewComponent = sdk.location.is(locations.LOCATION_APP) ? Config : AnimalPicture;
  return <NewComponent sdk={sdk} />;
};

export default AnimalApp;
