import React from 'react';
import PropTypes from 'prop-types';
import { FieldGroup, FormLabel, Select, Option } from '@contentful/forma-36-react-components';

import SectionWrapper from '../SectionWrapper';

import Hubspot from './Providers/Hubspot';
import Redirect from './Providers/Redirect';

const mappings = {
  hubspot: Hubspot,
  redirect: Redirect
};

function FormInfo({ formConfig }) {
  const Provider = mappings[formConfig.type];

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
          <Option value="redirect">Redirect</Option>
        </Select>
      </FieldGroup>
      {Provider && <Provider formConfig={formConfig} />}
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
