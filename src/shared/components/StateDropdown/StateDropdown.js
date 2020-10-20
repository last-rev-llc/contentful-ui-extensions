import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel, Select, Option } from '@contentful/forma-36-react-components';

const states = [
  { label: 'AL', value: 'Alabama' },
  { label: 'AK', value: 'Alaska' },
  { label: 'AZ', value: 'Arizona' },
  { label: 'AR', value: 'Arkansas' },
  { label: 'CA', value: 'California' },
  { label: 'CO', value: 'Colorado' },
  { label: 'CT', value: 'Connecticut' },
  { label: 'DE', value: 'Delaware' },
  { label: 'FL', value: 'Florida' },
  { label: 'GA', value: 'Georgia' },
  { label: 'HI', value: 'Hawaii' },
  { label: 'ID', value: 'Idaho' },
  { label: 'IL', value: 'Illinois' },
  { label: 'IN', value: 'Indiana' },
  { label: 'IA', value: 'Iowa' },
  { label: 'KS', value: 'Kansas' },
  { label: 'KY', value: 'Kentucky' },
  { label: 'LA', value: 'Louisiana' },
  { label: 'ME', value: 'Maine' },
  { label: 'MD', value: 'Maryland' },
  { label: 'MA', value: 'Massachusetts' },
  { label: 'MI', value: 'Michigan' },
  { label: 'MN', value: 'Minnesota' },
  { label: 'MS', value: 'Mississippi' },
  { label: 'MO', value: 'Missouri' },
  { label: 'MT', value: 'Montana' },
  { label: 'NE', value: 'Nebraska' },
  { label: 'NV', value: 'Nevada' },
  { label: 'NH', value: 'New Hampshire' },
  { label: 'NJ', value: 'New Jersey' },
  { label: 'NM', value: 'New Mexico' },
  { label: 'NY', value: 'New York' },
  { label: 'NC', value: 'North Carolina' },
  { label: 'ND', value: 'North Dakota' },
  { label: 'OH', value: 'Ohio' },
  { label: 'OK', value: 'Oklahoma' },
  { label: 'OR', value: 'Oregon' },
  { label: 'PA', value: 'Pennsylvania' },
  { label: 'RI', value: 'Rhode Island' },
  { label: 'SC', value: 'South Carolina' },
  { label: 'SD', value: 'South Dakota' },
  { label: 'TN', value: 'Tennessee' },
  { label: 'TX', value: 'Texas' },
  { label: 'UT', value: 'Utah' },
  { label: 'VT', value: 'Vermont' },
  { label: 'VA', value: 'Virginia' },
  { label: 'WA', value: 'Washington' },
  { label: 'WV', value: 'West Virginia' },
  { label: 'WI', value: 'Wisconsin' },
  { label: 'WY', value: 'Wyoming' }
];

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
            <Option key={state.label} value={state.value}>
              { state.label }
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
