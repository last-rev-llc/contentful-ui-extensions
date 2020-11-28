import React from 'react';
import PropTypes from 'prop-types';
import { FieldGroup, FormLabel, TextInput, Select, Option } from '@contentful/forma-36-react-components';
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
    </SectionWrapper>
  );
};

CreateForm.propTypes = {
  formConfig: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,

    setType: PropTypes.func,
    setTitle: PropTypes.func
  }).isRequired
};

CreateForm.defaultProps = {};

export default CreateForm;
