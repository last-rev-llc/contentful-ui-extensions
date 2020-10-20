import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel, Select, Option } from '@contentful/forma-36-react-components';

const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

function StateDropdown({ className, name, labelText, value, onChange, required }) {
  return (
    <>
      {
        labelText && <FormLabel htmlFor={name} required={required}>{ labelText }</FormLabel>
      }
      <Select className={className} name={name} value={value} onChange={onChange} required={required}>
        <Option value="">Select a state</Option>
        {
          states.map(state => (
            <Option key={state} value={state}>
              { state }
            </Option>
          ))
        }
      </Select>
    </>
  );
}

StateDropdown.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool
};

StateDropdown.defaultProps = {
  className: null,
  labelText: '',
  value: '',
  onChange: null,
  required: false
};

export default StateDropdown;
