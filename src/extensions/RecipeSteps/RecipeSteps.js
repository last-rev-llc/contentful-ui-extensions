import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { 
  Textarea, 
  TextInput, 
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@contentful/forma-36-react-components';

const getTextArea = (textValue, onChange) => {
  return <Textarea
    className=""
    id="body"
    maxLength={500}
    name="body"
    placeholder="Body"
    onChange={event => onChange(event)}
    required
    rows={4}
    testId="cf-ui-body-textarea"
    value={textValue}
    width="large" />;
};

const getTextInput = (textValue, onChange) => {
  return <TextInput
    className=""
    id="title"
    name="title"
    placeholder="Title"
    onChange={event => onChange(event)}
    required
    testId='cf-ui-text-input-title'
    value={textValue}
    width="large" />;
};

const getButton = (label, buttonType, onClick) => {
  return <Button
    buttonType={buttonType}
    isFullWidth={false}
    loading={false}
    onClick={onClick}
    testId={`cf-ui-button-${label}`}
    type="button">
    {label}
  </Button>;
};

const RecipeSteps = ({ sdk }) => {
  const [steps, setSteps] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if(sdk.field.getValue()) {
      setSteps(sdk.field.getValue());
    }
  }, [sdk.field]);

  const addStep = () => {
    const updatedSteps = steps;
    updatedSteps.push({ title, body });
    sdk.field.setValue(updatedSteps);
    setSteps(updatedSteps);
    setTitle('');
    setBody('');
  };

  const editStep = (stepIndex) => {
    
  };

  const deleteStep = (stepIndex) => {
    if (stepIndex > -1) {
      const updatedSteps = steps.filter((step, i) => i !== stepIndex);
      sdk.field.setValue(updatedSteps);
      setSteps(updatedSteps);
    }
  };

  const getStepRows = () => {
    return steps.map((step, index) => {
      const keyId = index;
      return (
        <TableRow key={keyId}>
          <TableCell>{step.title}</TableCell>
          <TableCell>{step.body}</TableCell>
          <TableCell>{getButton('Edit', 'primary', () => editStep(index))}{getButton('Delete', 'negative', () => deleteStep(index))}</TableCell>
        </TableRow>
      );
    });
  };
  
  const getStepsTable = () => {
    return steps.length === 0
      ? null 
      : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Body</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getStepRows()}
            </TableBody>
          </Table>
        </>
      );
  };

  return (
    <>
      <div>
        {getTextInput(title, (event) => setTitle(event.currentTarget.value))}
        {getTextArea(body, (event) => setBody(event.currentTarget.value))}
        {getButton('Add', 'positive', addStep)}
      </div>
      <div>
        {getStepsTable(steps, editStep, deleteStep)}
      </div>
    </>
  );
  
};

RecipeSteps.propTypes = {
  sdk: PropTypes.shape({
    field: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired
    }),
  }).isRequired
};

export {
  getTextArea,
  getTextInput,
  getButton,
};

export default RecipeSteps;

