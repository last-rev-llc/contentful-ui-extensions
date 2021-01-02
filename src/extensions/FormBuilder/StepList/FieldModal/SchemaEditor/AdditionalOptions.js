import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { get, set } from 'lodash';
import { TextField } from '@contentful/forma-36-react-components';

const SchemaOptionsStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  flex-wrap: wrap;
`;

function addDynamicWidth({ grow }) {
  if (!grow) return 'width: 100%:';

  return `flex-grow: ${grow};`;
}

const AdjustableTextField = styled(TextField)`
  width: auto;
  flex-grow: 1;

  ${addDynamicWidth}
`;

function buildTypeWithError(type, label, id, messageType) {
  return [
    {
      id,
      type,
      label,
      grow: '0.1'
    },
    {
      grow: '0.6',
      type: 'text',
      label: 'Error message',
      id: `messages.${type}${messageType}`
    }
  ];
}

function buildRegexp() {
  return [
    {
      type: 'text',
      id: 'pattern',
      label: 'Custom Regexp'
    }
  ];
}

function buildStraddle(type, labelMin, labelMax) {
  return (
    []
      // prettier-no-wrap
      .concat(buildTypeWithError(type, labelMin, 'min', 'Min'))
      .concat(buildTypeWithError(type, labelMax, 'max', 'Max'))
  );
}

const FieldsForTypes = {
  number: buildStraddle('number', 'Minimum', 'Maximum'),
  string: buildStraddle('string', 'Minimum Length', 'Maximum Length').concat(buildRegexp())
};

console.log(FieldsForTypes);

function resolveValue(value, type) {
  switch (type) {
    case 'number':
      if (value) return Number.parseInt(value, 10);
      return 0;

    default:
      return value;
  }
}

function AdditionalOptions({ field, updateField }) {
  const { schema = {} } = field;

  console.log(schema);
  const optionsForType = FieldsForTypes[schema.type];
  if (!optionsForType) return null;

  return (
    <SchemaOptionsStyle>
      {optionsForType.map(({ id, label, type, grow }) => (
        <AdjustableTextField
          key={id}
          id={id}
          name={id}
          type={type}
          grow={grow}
          value={get(schema, id, '')}
          labelText={label}
          onChange={(event) => {
            const { value } = event.currentTarget;

            // Convert to number/bool etc
            const resolvedValue = resolveValue(value, type);

            // Allow deep setting of schema key
            updateField('schema', set(schema, id, resolvedValue));
          }}
        />
      ))}
    </SchemaOptionsStyle>
  );
}

AdditionalOptions.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({
    schema: PropTypes.shape({
      type: PropTypes.string
    })
  })
};

AdditionalOptions.defaultProps = {
  field: {}
};

export default AdditionalOptions;
