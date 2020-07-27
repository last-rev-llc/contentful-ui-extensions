import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FieldGroup,
} from '@contentful/forma-36-react-components';
import { getTextInputWithLabel, getTextAreaWithLabel } from '../helpers';
import { getButton } from '../../../shared/helpers';

const StepDialog = ({ sdk }) => {
  const [step, setStep] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (sdk.parameters.invocation.step) {
      setStep(sdk.parameters.invocation.step.step);
      setTitle(sdk.parameters.invocation.step.title);
      setBody(sdk.parameters.invocation.step.body);
    }
  }, [sdk]);

  const closeDialog = () => {
    sdk.close();
  };

  const saveStep = () => {
    sdk.close({ step: +step, title, body });
  };

  return (
    <div id='dialog-step-wrap'
      data-test-id="StepDialog">
      <Form spacing="default"
        data-test-id="StepDialog-Form">
        <FieldGroup>
          {getTextInputWithLabel(step, 'Step', (event) => setStep(event.currentTarget.value), { type: 'number', id: 'step', name: 'step', placeholder: 'Step' })}
        </FieldGroup>
        <FieldGroup>
          {getTextInputWithLabel(title, 'Title', (event) => setTitle(event.currentTarget.value))}
        </FieldGroup >
        <FieldGroup >
          {getTextAreaWithLabel(body, 'Body', (event) => setBody(event.currentTarget.value))}
        </FieldGroup>
        <FieldGroup row>
          {getButton('Save', 'positive', saveStep)}
          {getButton('Cancel', 'muted', closeDialog)}
        </FieldGroup>
      </Form>
    </div>
  );

};

StepDialog.propTypes = {
  sdk: PropTypes.shape({
    close: PropTypes.func.isRequired,
    parameters: PropTypes.shape({
      invocation: PropTypes.shape({
        step: PropTypes.shape({
          step: PropTypes.string,
          title: PropTypes.string,
          body: PropTypes.string
        })
      }).isRequired
    }).isRequired
  }).isRequired
};

export default StepDialog;

