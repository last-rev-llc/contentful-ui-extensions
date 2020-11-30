import React from 'react';
import PropTypes from 'prop-types';
import { FieldGroup, FormLabel, TextInput, Select, Option } from '@contentful/forma-36-react-components';

import { URL_TYPES } from '../utils';
import SectionWrapper from '../SectionWrapper';

const CreateForm = ({ formConfig }) => {
  return (
    <SectionWrapper title="General">
      <FieldGroup>
        <FormLabel htmlFor="name">Form Name</FormLabel>
        <TextInput
          required
          name="title"
          id="title"
          value={formConfig.title}
          onChange={(e) => formConfig.setTitle(e.currentTarget.value)}
        />
      </FieldGroup>
      <FieldGroup>
        <FormLabel htmlFor="type">Form Type</FormLabel>
        <Select
          required
          id="type"
          name="type"
          value={formConfig.type}
          onChange={(e) => formConfig.setType(e.currentTarget.value)}>
          <Option value="custom">Custom</Option>
          <Option value="hubspot">Hubspot</Option>
        </Select>
      </FieldGroup>
      {URL_TYPES.includes(formConfig.type) && (
        <FieldGroup>
          <FormLabel htmlFor="name">Form URL</FormLabel>
          <TextInput
            required
            name="url"
            id="url"
            value={formConfig.url}
            onChange={(e) => formConfig.setUrl(e.currentTarget.value)}
          />
        </FieldGroup>
      )}
    </SectionWrapper>
  );
};

CreateForm.propTypes = {
  formConfig: PropTypes.shape({
    url: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,

    setUrl: PropTypes.func,
    setType: PropTypes.func,
    setTitle: PropTypes.func
  }).isRequired
};

CreateForm.defaultProps = {};

export default CreateForm;
