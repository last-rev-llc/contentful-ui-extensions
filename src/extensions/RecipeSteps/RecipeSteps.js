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
  TableRow,
  Modal,
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
  const [editPosition, setEditPosition] = useState(-1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if(sdk.field.getValue()) {
      setSteps(sdk.field.getValue());
    }
  }, [sdk.field]);

  const openAddModal = () => {
    setTitle('');
    setBody('');
    setIsAddOpen(true);
  };

  const openEditModal = (stepIndex) => {
    const step = steps[stepIndex];
    if (step) {
      setTitle(step.title);
      setBody(step.body);
      setEditPosition(stepIndex);
      setIsEditOpen(true);
    }
  };

  const addStep = () => {
    const updatedSteps = steps;
    updatedSteps.push({ title, body });
    sdk.field.setValue(updatedSteps);
    setSteps(updatedSteps);
    setTitle('');
    setBody('');
    setIsAddOpen(false);
  };

  const editStep = () => {
    const updatedSteps = steps;
    if (updatedSteps[editPosition]) {
      updatedSteps[editPosition].title = title;
      updatedSteps[editPosition].body = body;
      setSteps(updatedSteps);
      setTitle('');
      setBody('');
      setIsEditOpen(false);
      setEditPosition(-1);
    }
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
          <TableCell>{getButton('Edit', 'primary', () => openEditModal(index))}{getButton('Delete', 'negative', () => deleteStep(index))}</TableCell>
        </TableRow>
      );
    });
  };

  const getAddModal = () => {
    return (
      <Modal title="Add Step"
        isShown={isAddOpen}
        position="center">
        <Modal.Header title="Add Step" />
        <Modal.Content>
          <div>
            {getTextInput(title, (event) => setTitle(event.currentTarget.value))}
            {getTextArea(body, (event) => setBody(event.currentTarget.value))}
          </div>
        </Modal.Content>
        <Modal.Controls>
          {getButton('Add', 'positive', addStep)}
          {getButton('Close', 'muted', () => setIsAddOpen(false))}
        </Modal.Controls>
      </Modal>
    );
  };

  const getEditModal = () => {
    return (
      <Modal title="Edit Step"
        isShown={isEditOpen}
        position="center">
        <Modal.Header title="Edit Step" />
        <Modal.Content>
          <div>
            {getTextInput(title, (event) => setTitle(event.currentTarget.value))}
            {getTextArea(body, (event) => setBody(event.currentTarget.value))}
          </div>
        </Modal.Content>
        <Modal.Controls>
          {getButton('Edit', 'primary', editStep)}
          {getButton('Close', 'muted', () => setIsAddOpen(false))}
        </Modal.Controls>
      </Modal>
    );
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
        {getButton('Add', 'positive', openAddModal)}
      </div>
      <div>
        {getStepsTable()}
      </div>
      <div>
        {getAddModal()}
        {getEditModal()}
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

