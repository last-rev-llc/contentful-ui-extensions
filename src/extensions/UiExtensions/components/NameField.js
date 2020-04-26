import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@contentful/forma-36-react-components';

const NameField = ({ nameField, onNameChange, readOnly }) => {

  return (
    <div>
      <TextInput
        className=""
        disabled={readOnly}
        id="keyName"
        name="keyName"
        onChange={event => onNameChange(event)}
        required
        testId="cf-ui-text-input-key-name"
        value={nameField}
        width="medium" />
    </div>
  );
};

NameField.propTypes = {
  nameField: PropTypes.string.isRequired,
  onNameChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired
};

export default NameField;