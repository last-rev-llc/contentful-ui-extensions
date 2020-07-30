import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Form, 
  FieldGroup, 
} from '@contentful/forma-36-react-components';
import { getTextAreaWithLabel } from '../helpers';
import { getButton, getTextField } from '../../../shared/helpers';

const StepDialog = ({ sdk }) => {
  const [step, setStep] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [stepErrorMessage, setStepErrorMessage] = useState('');
  const [titleErrorMessage, setTitleErrorMessage] = useState('');

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
    const errorMessage = 'This item is required';
    if (step && title) {
      sdk.close({ step: +step, title, body });
    }
    else {
      setStepErrorMessage(!step ? errorMessage : '');
      setTitleErrorMessage(!title ? errorMessage : '');
    }
    
  };

  return (
    <div id='dialog-step-wrap'>
      <Form spacing="default">
        <FieldGroup>
          {getTextField(step, (event) => setStep(event.currentTarget.value), stepErrorMessage, { id: 'stepNumber', type: 'number', labelText: 'Step Number', required: true })}
        </FieldGroup>
        <FieldGroup>
          {getTextField(step, (event) => setTitle(event.currentTarget.value), titleErrorMessage, { id: 'title', labelText: 'Title', required: true })}
        </FieldGroup>
        <FieldGroup>
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

