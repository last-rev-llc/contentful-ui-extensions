import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FieldGroup, SelectField, Option } from '@contentful/forma-36-react-components';

import AdditionalOptions from './AdditionalOptions';

const SchemaWrapper = styled(FieldGroup)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const FastestValidatorTypes = [
  // prettier-no-wrap
  { label: 'Any', value: 'any' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Email', value: 'email' },
  { label: 'Equals value', value: 'equal' },
  { label: 'Number', value: 'number' },
  { label: 'Object', value: 'object' },
  { label: 'String', value: 'string' },
  { label: 'Url', value: 'url' },
  { label: 'UUID', value: 'uuid' }
];

// eslint-disable-next-line no-unused-vars
function validatorTypesForField({ type }) {
  // TODO: Which types for which fields
  //       think about NPM module
  return FastestValidatorTypes;
}

function SchemaEditor({ field, updateField }) {
  const { schema = {} } = field;

  return (
    <SchemaWrapper>
      <SelectField
        labelText="Field Schema"
        id="schema.type"
        name="schema.type"
        value={schema.type || 'any'}
        onChange={(event) =>
          updateField('schema', {
            type: event.currentTarget.value
          })
        }>
        {validatorTypesForField(field).map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </SelectField>
      <AdditionalOptions field={field} updateField={updateField} />
    </SchemaWrapper>
  );
}

SchemaEditor.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    schema: PropTypes.shape({
      type: PropTypes.string
    })
  })
};

SchemaEditor.defaultProps = {
  field: {}
};

export default SchemaEditor;
