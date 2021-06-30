import React from 'react';
import PropTypes from 'prop-types';
import { FieldGroup, FormLabel, TextInput } from '@contentful/forma-36-react-components';

function Hubspot({ formConfig }) {
  return (
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
  );
}

Hubspot.propTypes = {
  formConfig: PropTypes.shape({
    formId: PropTypes.string,
    portalId: PropTypes.string,
    type: PropTypes.string,

    setFormId: PropTypes.func,
    setPortalId: PropTypes.func,
    setType: PropTypes.func
  }).isRequired
};

Hubspot.defaultProps = {};

export default Hubspot;
