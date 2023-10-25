/* eslint-disable react/forbid-prop-types */

import React, { useEffect, useState, useRef } from 'react';
import jsonLogic from 'json-logic-js';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton, FieldGroup, FormLabel, Textarea, CheckboxField } from '@contentful/forma-36-react-components';

import { update } from 'lodash';
import { safeParse } from '../utils';

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

export function isValidJson(json) {
  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
}

function DependsOn({ value: initialValue, tests: initialTests, onChangeValue, onChangeTests }) {
  const [value, setValue] = useState(JSON.stringify(initialValue, null, 4));
  const [tests, setTests] = useState(initialTests.map((test) => JSON.stringify(test, null, 4)));

  const dependsOnError = isValidJson(value) === false;
  const [enabled, setEnabled] = useState(Object.keys(initialValue).length > 0);

  console.log('DependsOn', {
    logic: value,
    initialValue,
    initialTests,
    onChangeValue,
    onChangeTests,
    value,
    tests
  });

  const jsonLogicRef = useRef(null);

  const updateJson = (newValue) => {
    setValue(newValue);

    if (isValidJson(newValue)) {
      onChangeValue(JSON.parse(newValue));
    }
  };

  useEffect(() => {
    if (enabled) {
      updateJson(jsonLogicRef.current.value);
    } else {
      updateJson('{}');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // if (!value) {
  //   return (
  //     <CheckboxField
  //       checked={value}
  //       id="dependsOnEnabled"
  //       name="dependsOnEnabled"
  //       labelText="Enable dependsOn logic"
  //       onClick={() =>
  //         setValue((prev) => {
  //           console.log('setValue');
  //           onChangeValue(!prev);
  //           return !prev;
  //         })
  //       }
  //     />
  //   );
  // }

  return (
    <>
      <CheckboxField
        id="dependsOnEnabled"
        name="dependsOnEnabled"
        labelText="Disable dependsOn logic"
        checked={enabled}
        onClick={() => setEnabled((prev) => !prev)}
      />
      <FieldGroup>
        <FormLabel htmlFor="title">Depends On logic</FormLabel>
        <JsonTextArea
          textareaRef={jsonLogicRef}
          required
          value={value}
          onChange={(e) => {
            const { value: newValue } = e.currentTarget;
            updateJson(newValue);
          }}
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
                  const newValue = e.currentTarget.value;
                  const newTests = tests.map((oldTest, currentIndex) => (currentIndex === index ? newValue : oldTest));

                  setTests(newTests);

                  if (newTests.every(isValidJson)) {
                    onChangeTests(newTests.map(JSON.parse));
                  }
                }}
                defaultValue={test}
              />
              <ResultArea>
                <DeleteButton
                  label="Delete test"
                  buttonType="negative"
                  iconProps={{ icon: 'Delete' }}
                  onClick={() => {
                    const newTests = tests.filter((_, i) => i !== index);
                    setTests(newTests);
                    onChangeTests(newTests.map(JSON.parse));
                  }}
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
      <AddRow onClick={() => setTests(tests.concat('{}'))}>
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
  tests: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.object
};

DependsOn.defaultProps = {
  tests: [],
  value: {}
};

export default DependsOn;
