import React from 'react';
import PropTypes from 'prop-types';
import { FieldGroup, FormLabel, TextInput } from '@contentful/forma-36-react-components';

function Redirect({ formConfig }) {
  return (
    <>
      <FieldGroup>
        <FormLabel htmlFor="name">URL</FormLabel>
        <TextInput
          required
          id="url"
          name="url"
          value={formConfig.url}
          onChange={(e) => formConfig.setUrl(e.currentTarget.value)}
        />
      </FieldGroup>
    </>
  );
}

Redirect.propTypes = {
  formConfig: PropTypes.shape({
    url: PropTypes.string,
    type: PropTypes.string,
    setUrl: PropTypes.func,
    setType: PropTypes.func
  }).isRequired
};

Redirect.defaultProps = {};

export default Redirect;
