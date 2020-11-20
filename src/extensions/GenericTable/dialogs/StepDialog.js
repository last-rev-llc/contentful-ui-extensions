import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { TextField, Button, Form, FieldGroup } from '@contentful/forma-36-react-components';
import { withoutId, alphabeticalKeys } from '../helpers';

const ButtonGroupStyle = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 20px;
  }
`;

function StepDialog({ sdk }) {
  const [fields, setFields] = useState('');

  const setFieldsFromStep = (currentStep = {}, onlyKey = false) => {
    const toSet = {};
    Object.keys(currentStep).forEach((key) => {
      // Our built in keys
      if ([].includes(key)) return;

      toSet[key] = onlyKey ? '' : currentStep[key] || '';
    });
    setFields(toSet);
  };

  useEffect(() => {
    const { steps, step: currentStep } = sdk.parameters.invocation;

    if (currentStep) {
      setFieldsFromStep(currentStep);
    } else if (steps) {
      setFieldsFromStep(steps[0], true);
    }
  }, [sdk]);

  const closeDialog = () => {
    sdk.close();
  };

  const saveStep = () => {
    const { steps = [] } = sdk.parameters.invocation;
    sdk.close({
      // ID will be overriden if we're updating a step
      id: `${steps.length}-${uuidv4()}`,
      ...fields
    });
  };

  const setField = (name, value) => setFields({ ...fields, [name]: value });

  return (
    <div id="dialog-step-wrap" data-testid="StepDialog">
      <Form spacing="default" data-testid="StepDialog-Form">
        {alphabeticalKeys(withoutId(fields)).map((key) => (
          <FieldGroup key={key}>
            <TextField
              className=""
              id="title"
              name="title"
              labelText={key}
              placeholder="Title"
              onChange={(event) => setField(key, event.currentTarget.value)}
              testId="cf-ui-text-input-title"
              value={fields[key]}
              width="full"
            />
          </FieldGroup>
        ))}
        <ButtonGroupStyle>
          <Button buttonType="negative" isFullWidth={false} onClick={closeDialog} type="button">
            Cancel
          </Button>
          <Button buttonType="positive" isFullWidth={false} onClick={saveStep} type="button">
            Save
          </Button>
        </ButtonGroupStyle>
      </Form>
    </div>
  );
}

StepDialog.propTypes = {
  sdk: PropTypes.shape({
    close: PropTypes.func.isRequired,
    parameters: PropTypes.shape({
      invocation: PropTypes.shape({
        step: PropTypes.object,
        steps: PropTypes.arrayOf(PropTypes.object)
      }).isRequired
    }).isRequired
  }).isRequired
};

export default StepDialog;
