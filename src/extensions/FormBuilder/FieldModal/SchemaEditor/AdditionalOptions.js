import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { get, set } from 'lodash';
import { TextField } from '@contentful/forma-36-react-components';

import { schemaPropType } from './prop-types';

const SchemaOptionsStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  flex-wrap: wrap;
`;

function addDynamicWidth({ grow }) {
  if (!grow) return 'width: 100%:';

  return `flex-grow: ${grow};`;
}

const Spacer = styled.div`
  flex-grow: 1;
  width: 100%;
`;

const AdjustableTextField = styled(TextField)`
  width: auto;
  flex-grow: 1;
  max-width: 180px;
  margin-top: 1rem;
  margin-right: 0.5rem;

  ${addDynamicWidth}
`;

/** An input field on the left, with an error message input on the right */
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
      type: 'string',
      label: 'Error message',
      id: `messages.${type}${messageType}`
    },
    {
      type: 'spacer'
    }
  ];
}

/** Build a set of min-max input fields with error label input  */
function buildStraddle(type, labelMin, labelMax) {
  return (
    []
      // prettier-no-wrap
      .concat(buildTypeWithError(type, labelMin, 'min', 'Min'))
      .concat(buildTypeWithError(type, labelMax, 'max', 'Max'))
  );
}

/** Which schema types have additional fields */
const FieldsForTypes = {
  number: buildStraddle('number', 'Minimum', 'Maximum'),
  string: buildStraddle('string', 'Minimum Length', 'Maximum Length')
    /** A regular expression field */
    .concat(buildTypeWithError('string', 'Custom Regexp', 'pattern', 'Pattern'))
};

/** Allow extraction of numbered or boolean results */
function resolveValue(value, type) {
  switch (type) {
    case 'number':
      if (value) return Number.parseInt(value, 10);
      return 0;

    default:
      return value;
  }
}

/** Field validation type transformed to a F36 TextField type */
function inputTypeForFieldType(type) {
  switch (type) {
    case 'number':
      return type;

    case 'string':
    default:
      return 'text';
  }
}

function AdditionalOptions({ field, updateField }) {
  const { schema = {} } = field;

  const optionsForType = FieldsForTypes[schema.type];
  if (!optionsForType) return null;

  return (
    <SchemaOptionsStyle>
      {optionsForType.map(({ id, label, type, grow }) => {
        if (type === 'spacer') return <Spacer />;

        return (
          <AdjustableTextField
            key={id}
            id={id}
            name={id}
            grow={grow}
            labelText={label}
            value={get(schema, id, '')}
            type={inputTypeForFieldType(type)}
            onChange={(event) => {
              const { value } = event.currentTarget;

              // Convert to number/bool etc
              const resolvedValue = resolveValue(value, type);

              // Allow deep setting of schema key
              updateField('schema', set(schema, id, resolvedValue));
            }}
          />
        );
      })}
    </SchemaOptionsStyle>
  );
}

AdditionalOptions.propTypes = {
  updateField: PropTypes.func.isRequired,
  field: PropTypes.shape({ schema: schemaPropType })
};

AdditionalOptions.defaultProps = {
  field: {}
};

export default AdditionalOptions;
