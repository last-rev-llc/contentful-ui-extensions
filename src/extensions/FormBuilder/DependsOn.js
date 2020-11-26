import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FieldGroup, FormLabel, Textarea } from '@contentful/forma-36-react-components';

const JsonTextArea = styled(Textarea)`
  ${({ $hasError: hasError }) => hasError && `border-left: 2px solid red;`}
`;

const ErrorText = styled.span`
  color: red;
`;

export function isJsonValid(json) {
  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
}

function DependsOn({ value, onChange }) {
  const jsonError = isJsonValid(value) === false;

  return (
    <FieldGroup>
      <FormLabel htmlFor="title">Depends On</FormLabel>
      <JsonTextArea required $hasError={jsonError} onChange={onChange} defaultValue={value} />
      {jsonError && <ErrorText>Invalid JSON</ErrorText>}
    </FieldGroup>
  );
}

DependsOn.propTypes = {
  onChange: PropTypes.func.isRequired,

  // our dependsOn object (jsonLogic)
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.object
};

DependsOn.defaultProps = {
  value: {}
};

export default DependsOn;
