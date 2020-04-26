import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@contentful/forma-36-react-components';

const ValueField = ({ valueField, onValueChange }) => {

  return (
    <div>
      <TextInput
        className=""
        id="keyValue"
        name="keyValue"
        onChange={event => onValueChange(event)}
        required={false}
        testId="cf-ui-text-input-key-value"
        value={valueField}
        width="medium" />
    </div>
  );
};

ValueField.propTypes = {
  valueField: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired
};

export default ValueField;