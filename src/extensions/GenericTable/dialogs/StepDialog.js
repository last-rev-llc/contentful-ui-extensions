import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Button, Form, FieldGroup } from '@contentful/forma-36-react-components';
import { getTextAreaWithLabel, withoutId } from '../helpers';
import { getTextField } from '../../../shared/helpers';

const ButtonGroupStyle = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 20px;
  }
`;

function StepDialog({ sdk }) {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState('');
  const [titleErrorMessage, setTitleErrorMessage] = useState('');

  const setFieldsFromStep = (currentStep = {}, onlyKey = false) => {
    const toSet = {};
    Object.keys(currentStep).forEach((key) => {
      // Our built in keys
      if (['title'].includes(key)) return;

      toSet[key] = onlyKey ? '' : currentStep[key] || '';
    });
    setFields(toSet);
  };

  useEffect(() => {
    const { steps, step: currentStep } = sdk.parameters.invocation;

    if (currentStep) {
      setFieldsFromStep(currentStep);
      setTitle(currentStep.title);
    } else if (steps) {
      setFieldsFromStep(steps[0], true);
    }
  }, [sdk]);

  const closeDialog = () => {
    sdk.close();
  };

  const saveStep = () => {
    const { steps = [] } = sdk.parameters.invocation;
    const errorMessage = 'This item is required';
    if (title) {
      sdk.close({
        // ID will be overriden if we're updating a step
        id: `${steps.length}-${uuidv4()}`,
        title,
        ...fields
      });
    } else {
      setTitleErrorMessage(!title ? errorMessage : '');
    }
  };

  const setField = (name, value) => setFields({ ...fields, [name]: value });

  return (
    <div id="dialog-step-wrap" data-testid="StepDialog">
      <Form spacing="default" data-testid="StepDialog-Form">
        <FieldGroup>
          {getTextField(title, (event) => setTitle(event.currentTarget.value), titleErrorMessage, {
            id: 'title',
            labelText: 'Title',
            required: true
          })}
        </FieldGroup>
        {Object.entries(withoutId(fields)).map(([key, value]) => (
          <FieldGroup key={key}>
            {getTextAreaWithLabel(value, key, (event) => setField(key, event.currentTarget.value))}
          </FieldGroup>
        ))}
        <ButtonGroupStyle>
          <Button buttonType="negative" isFullWidth={false} onClick={closeDialog} type="button">
            Cancel
          </Button>
          <Button
            buttonType="positive"
            isFullWidth={false}
            disabled={title.length < 1}
            onClick={saveStep}
            type="button">
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
