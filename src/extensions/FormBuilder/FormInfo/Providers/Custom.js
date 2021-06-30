import React from 'react';
import PropTypes from 'prop-types';
import { FieldGroup, FormLabel, TextInput, Select, Option } from '@contentful/forma-36-react-components';

function Custom({ formConfig }) {
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
      <FieldGroup>
        <FormLabel htmlFor="method">Method</FormLabel>
        <Select
          required
          id="method"
          name="method"
          value={formConfig.method}
          onChange={(e) => formConfig.setMethod(e.currentTarget.value)}>
          <Option value="GET">GET</Option>
          <Option value="POST">POST</Option>
        </Select>
      </FieldGroup>
    </>
  );
}

Custom.propTypes = {
  formConfig: PropTypes.shape({
    url: PropTypes.string,
    method: PropTypes.string,
    type: PropTypes.string,
    setUrl: PropTypes.func,
    setType: PropTypes.func,
    setMethod: PropTypes.func
  }).isRequired
};

Custom.defaultProps = {};

export default Custom;
