import React from 'react';
import PropTypes from 'prop-types';
import { FieldGroup, FormLabel, TextInput, Select, Option } from '@contentful/forma-36-react-components';

import { URL_TYPES } from '../utils';
import SectionWrapper from '../SectionWrapper';

function FormInfo({ formConfig }) {
  return (
    <SectionWrapper title="General">
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
        <>
          <FieldGroup>
            <FormLabel htmlFor="name">Form ID</FormLabel>
            <TextInput
              required
              id="formId"
              name="formId"
              value={formConfig.formId}
              onChange={(e) => formConfig.setFormId(e.currentTarget.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="name">Portal ID</FormLabel>
            <TextInput
              required
              id="portalId"
              name="portalId"
              value={formConfig.portalId}
              onChange={(e) => formConfig.setPortalId(e.currentTarget.value)}
            />
          </FieldGroup>
        </>
      )}
    </SectionWrapper>
  );
}

FormInfo.propTypes = {
  formConfig: PropTypes.shape({
    formId: PropTypes.string,
    portalId: PropTypes.string,
    type: PropTypes.string,

    setFormId: PropTypes.func,
    setPortalId: PropTypes.func,
    setType: PropTypes.func
  }).isRequired
};

FormInfo.defaultProps = {};

export default FormInfo;
