import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, FieldGroup } from '@contentful/forma-36-react-components';
import { getTextAreaWithLabel } from '../helpers';
import { getButton, getTextField } from '../../../shared/helpers';

function StepDialog({ sdk }) {
  const [step, setStep] = useState('');
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState('');
  const [stepErrorMessage, setStepErrorMessage] = useState('');
  const [titleErrorMessage, setTitleErrorMessage] = useState('');

  const setFieldsFromStep = (currentStep, onlyKey = false) => {
    const toSet = {};
    Object.keys(currentStep).forEach((key) => {
      // Our built in keys
      if (['step', 'title'].includes(key)) return;

      toSet[key] = onlyKey ? '' : currentStep[key] || '';
    });
    setFields(toSet);
  };

  useEffect(() => {
    const { steps, step: currentStep } = sdk.parameters.invocation;

    if (currentStep) {
      setFieldsFromStep(currentStep);
      setStep(currentStep.step);
      setTitle(currentStep.title);
    } else if (steps) {
      setFieldsFromStep(steps[0], true);
    }
  }, [sdk]);

  const closeDialog = () => {
    sdk.close();
  };

  const saveStep = () => {
    const errorMessage = 'This item is required';
    if (step && title) {
      sdk.close({ step: +step, title, ...fields });
    } else {
      setStepErrorMessage(!step ? errorMessage : '');
      setTitleErrorMessage(!title ? errorMessage : '');
    }
  };

  const setField = (name, value) => setFields({ ...fields, [name]: value });

  return (
    <div id="dialog-step-wrap" data-testid="StepDialog">
      <Form spacing="default" data-testid="StepDialog-Form">
        <FieldGroup>
          {getTextField(step, (event) => setStep(event.currentTarget.value), stepErrorMessage, {
            id: 'stepNumber',
            type: 'number',
            labelText: 'Step Number',
            required: true
          })}
        </FieldGroup>
        <FieldGroup>
          {getTextField(title, (event) => setTitle(event.currentTarget.value), titleErrorMessage, {
            id: 'title',
            labelText: 'Title',
            required: true
          })}
        </FieldGroup>
        {Object.entries(fields).map(([key, value]) => (
          <FieldGroup key={key}>
            {getTextAreaWithLabel(value, key, (event) => setField(key, event.currentTarget.value))}
          </FieldGroup>
        ))}
        <FieldGroup row>
          {getButton('Save', 'positive', saveStep)}
          {getButton('Cancel', 'muted', closeDialog)}
        </FieldGroup>
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
