/* eslint-disable react/forbid-prop-types */

import React from 'react';
import jsonLogic from 'json-logic-js';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FieldGroup, FormLabel, Textarea } from '@contentful/forma-36-react-components';

const JsonTextArea = styled(Textarea)`
  min-height: 50px;
  ${({ $hasError: hasError }) => hasError && `border-left: 4px solid red;`}
`;

const ErrorText = styled.span`
  color: red;
`;

export function isValidJson(json) {
  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
}

function testPasses(value, test) {
  try {
    return jsonLogic.apply(JSON.parse(value), JSON.parse(test));
  } catch (error) {
    return false;
  }
}

function DependsOn({ value, test, onChangeValue, onChangeTest }) {
  const testError = isValidJson(test) === false;
  const dependsOnError = isValidJson(value) === false;

  return (
    <>
      <FieldGroup>
        <FormLabel htmlFor="title">Depends On</FormLabel>
        <JsonTextArea required defaultValue={value} onChange={onChangeValue} $hasError={dependsOnError} />
        {dependsOnError && <ErrorText>Invalid JSON</ErrorText>}
        {test && !testPasses(value, test) && (
          <ErrorText>
            Schema does not match test. See <a href="https://jsonlogic.com/operations.html">jsonLogic</a>
          </ErrorText>
        )}
      </FieldGroup>

      {/* TODO: It would be nice to have multiple tests here */}
      <FieldGroup>
        <FormLabel htmlFor="title">Test data</FormLabel>
        <JsonTextArea $hasError={testError} onChange={onChangeTest} defaultValue={test} />
        {testError && <ErrorText>Invalid JSON</ErrorText>}
      </FieldGroup>
    </>
  );
}

DependsOn.propTypes = {
  onChangeValue: PropTypes.func.isRequired,
  onChangeTest: PropTypes.func.isRequired,

  // our dependsOn object (jsonLogic)
  test: PropTypes.string,
  value: PropTypes.string
};

DependsOn.defaultProps = {
  test: '{}',
  value: '{}'
};

export default DependsOn;
