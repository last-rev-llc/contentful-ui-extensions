import React from 'react';
import {
  has, isArray, each, get,
} from 'lodash';
import { init as initContentfulExtension } from 'contentful-ui-extensions-sdk';
import './Colors.scss';

class Colors extends React.Component {
  colorCardsArray = [];

  constructor(props) {
    super(props);
    this.state = {
      api: {},
      value: '',
      hexs: [],
    };
  }

  componentWillMount() {
    initContentfulExtension((api) => {
      this.setState({
        value: api.field.getValue(),
        api,
        hexs: this.getHexOptions(api),
      });
      api.window.startAutoResizer();
    });
  }


  getHexOptions = (api) => {
    const { validations } = api.field;
    const hexOptions = [];
    each(validations, (val) => {
      if (has(val, 'in') && isArray(get(val, 'in'))) {
        each(get(val, 'in'), (hex) => {
          hexOptions.push(hex);
        });
      }
    });
    return hexOptions;
  }

  handleColorChange = (e) => {
    const hex = e.currentTarget.getAttribute('data-hex');
    const { api } = this.state;
    api.field.setValue(hex);
    this.setState({
      value: hex,
    });
  }

  render() {
    const { value, hexs } = this.state;
    const dark = ['#000000', '#6B7C8D', '#445669'];
    return (
      <div id="colors">
        {hexs.map((hex, index) => (
          <div
            className={`card ${dark.includes(hex) ? 'dark' : ''} ${value === hex ? 'selected' : ''}`}
            style={{ backgroundColor: hex }}
            data-hex={hex}
            onClick={this.handleColorChange}
            onKeyDown={this.handleColorChange}
            role="button"
            tabIndex={index}
            key={hex}
          >
            <h4>
              {hex}
            </h4>
          </div>
        ))}
      </div>
    );
  }
}

export default Colors;
