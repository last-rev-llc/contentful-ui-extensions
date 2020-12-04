/* eslint-disable react/forbid-prop-types */

import React, { useState } from 'react';
import jsonLogic from 'json-logic-js';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton, FieldGroup, FormLabel, Textarea, CheckboxField } from '@contentful/forma-36-react-components';

import { safeParse } from './utils';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const AddRow = styled(Row)`
  button {
    margin-right: 8px;

    position: relative;
    top: 4px;
  }
`;

const JsonTextArea = styled(Textarea)`
  min-height: 50px;
  ${({ $hasError: hasError }) => hasError && `border-left: 4px solid red;`}
`;

const ResultArea = styled(Row)`
  position: relative;

  padding: 8px;
  align-items: center;
  justify-content: center;

  width: 30%;
  height: 100%;
  min-height: 50px;
`;

const ErrorText = styled.span`
  color: red;
`;

const TestRow = styled(Row)`
  background: whitesmoke;
`;

const DeleteButton = styled(IconButton)`
  position: absolute;
  top: 2px;
  right: 2px;
`;

export function isValidJson(json) {
  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
}

function runTest(value, test) {
  try {
    return jsonLogic.apply(safeParse(value), safeParse(test));
  } catch (error) {
    return false;
  }
}

function testPasses(value, test) {
  try {
    runTest(value, test);
    return true;
  } catch (error) {
    return false;
  }
}

function DependsOn({ value, tests, onChangeValue, onChangeTests }) {
  const dependsOnError = isValidJson(value) === false;
  const [enabled, setEnabled] = useState(value.length > 2);

  if (!enabled) {
    return (
      <CheckboxField
        checked={enabled}
        labelText="Enable/Disable dependsOn logic"
        onClick={() => setEnabled((prev) => !prev)}
      />
    );
  }

  return (
    <>
      <CheckboxField
        labelText="Enable/Disable dependsOn logic"
        checked={enabled}
        onClick={() =>
          setEnabled((prev) => {
            if (!prev) {
              return true;
            }

            // Disable the dependsOn entirely
            onChangeValue('{}');
            onChangeTests([]);
            return false;
          })
        }
      />
      <FieldGroup>
        <FormLabel htmlFor="title">Depends On logic</FormLabel>
        <JsonTextArea
          required
          defaultValue={value}
          onChange={(e) => onChangeValue(e.currentTarget.value)}
          $hasError={dependsOnError}
        />
        {dependsOnError && <ErrorText>Invalid JSON</ErrorText>}
      </FieldGroup>

      {tests.map((test, index) => {
        const testError = isValidJson(test) === false;

        return (
          <FieldGroup
            // NOTE: Tests do not contain ID so we pretty much require keyed by Idx here
            //       If you can think of a better way please replace
            // eslint-disable-next-line react/no-array-index-key
            key={index}>
            <FormLabel htmlFor="title">Test {index + 1}</FormLabel>
            <TestRow>
              <JsonTextArea
                $hasError={testError}
                onChange={(e) => {
                  tests.splice(index, 1, e.currentTarget.value);
                  onChangeTests(tests);
                }}
                defaultValue={test}
              />
              <ResultArea>
                <DeleteButton
                  label="Delete test"
                  buttonType="negative"
                  iconProps={{ icon: 'Delete' }}
                  onClick={() => onChangeTests(tests.filter((_, i) => i !== index))}
                />
                <pre>{JSON.stringify(runTest(value, test), null, 4)}</pre>
              </ResultArea>
            </TestRow>
            {testError && <ErrorText>Invalid JSON</ErrorText>}
            {!testPasses(value, test) && (
              <ErrorText>
                Schema does not match test. See <a href="https://jsonlogic.com/operations.html">jsonLogic</a>
              </ErrorText>
            )}
          </FieldGroup>
        );
      })}
      <AddRow onClick={() => onChangeTests(tests.concat('{}'))}>
        <IconButton
          label="Add new test"
          buttonType="primary"
          size="small"
          className="card-item-button"
          iconProps={{ icon: 'PlusCircle' }}>
          Add a new dependsOn test
        </IconButton>
        <span>Add test</span>
      </AddRow>
    </>
  );
}

DependsOn.propTypes = {
  onChangeValue: PropTypes.func.isRequired,
  onChangeTests: PropTypes.func.isRequired,

  // our dependsOn object (jsonLogic)
  tests: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string
};

DependsOn.defaultProps = {
  tests: [],
  value: '{}'
};

export default DependsOn;
