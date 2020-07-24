import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getTextInput, getTextArea, getButton } from '../helpers/index';

const StepDialog = ({ sdk }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (sdk.parameters.invocation.step) {
      setTitle(sdk.parameters.invocation.step.title);
      setBody(sdk.parameters.invocation.step.body);
    }
  }, [sdk]);
  
  const closeDialog = (step) => {
    sdk.close({ step });
  };
  
  const saveStep = () => {
    closeDialog({ title, body });
  };

  return (
    <>
      {getTextInput(title, (event) => setTitle(event.currentTarget.value))}
      {getTextArea(body, (event) => setBody(event.currentTarget.value))}
      {getButton('Save', 'positive', saveStep)}
      {getButton('Close', 'muted', closeDialog)}
    </>
  );
  
};

StepDialog.propTypes = {
  sdk: PropTypes.shape({
    close: PropTypes.func.isRequired,
    parameters: PropTypes.shape({
      invocation: PropTypes.shape({
        step: PropTypes.shape({
          title: PropTypes.string,
          body: PropTypes.string
        })
      }).isRequired
    }).isRequired
  }).isRequired
};

export default StepDialog;

