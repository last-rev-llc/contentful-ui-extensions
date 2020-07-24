import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Form, 
  FieldGroup, 
} from '@contentful/forma-36-react-components';
import { getTextInputWithLabel, getTextAreaWithLabel, getButton } from '../helpers/index';

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
    sdk.close({step});
  };
  
  const saveStep = () => {
    closeDialog({ title, body });
  };

  return (
    <div id='dialog-step-wrap'>
      <Form spacing="default">
        <FieldGroup>
          {getTextInputWithLabel(title, 'Title', (event) => setTitle(event.currentTarget.value))}
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
          title: PropTypes.string,
          body: PropTypes.string
        })
      }).isRequired
    }).isRequired
  }).isRequired
};

export default StepDialog;

