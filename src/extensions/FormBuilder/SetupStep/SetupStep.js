import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import {
  Modal,
  Form,
  FieldGroup,
  FormLabel,
  TextInput,
  Button,
} from "@contentful/forma-36-react-components";
import arrayMove from "array-move";
import SortableList from "../SortableList";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";

const SetupStepPropTypes = {
  step: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const SetupStep = ({ step, onClose, onSubmit }) => {
  const [values, setValues] = useState();
  const [removeField, setRemoveField] = useState();

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setValues((prev) => ({
      ...prev,
      fields: arrayMove(prev.fields, oldIndex, newIndex),
    }));
  };

  const handleOpenRemoveField = (field) => () => {
    setRemoveField(field);
  };

  const handleCancelRemoveField = () => setRemoveField();

  const handleRemoveField = () => {
    if (removeField) {
      setValues((prev) => ({
        ...prev,
        fields: prev.fields.filter((o) => o.id !== removeField.id),
      }));
      handleCancelRemoveField();
    }
  };

  const handleAddField = () => {
    setValues((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          id: uuidv4(),
          title: `New Field ${prev.fields.length + 1}`,
          fields: [],
        },
      ],
    }));
  };

  useEffect(() => {
    setValues(step);
  }, [step]);

  if (!values) return null;
  return (
    <>
      <Modal title={values.title} isShown size="fullWidth" onClose={onClose}>
        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            <FormLabel htmlFor="title">Step Name</FormLabel>
            <TextInput
              required
              name="title"
              id="title"
              value={values.title}
              onChange={handleChange("title")}
            />
          </FieldGroup>
          <FieldGroup>
            <FormLabel htmlFor="title">Fields</FormLabel>
            <SortableList
              items={values.fields}
              onSortEnd={handleSortEnd}
              onRemoveItem={handleOpenRemoveField}
              onEditItem={() => {}}
            />
          </FieldGroup>
          <FieldGroup>
            <Button size="small" onClick={handleAddField}>
              Add Field
            </Button>
          </FieldGroup>
          <FieldGroup>
            <div className="confirm-delete-dialog-actions">
              <Button
                type="submit"
                buttonType="negative"
                size="small"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                disabled={values.title.trim() === ""}
                size="small"
                type="submit"
                className="confirm-delete-dialog-button"
              >
                Save
              </Button>
            </div>
          </FieldGroup>
        </Form>
      </Modal>
      <ConfirmDeleteDialog
        item={removeField}
        onClose={handleCancelRemoveField}
        onSubmit={handleRemoveField}
      />
    </>
  );
};

SetupStep.propTypes = SetupStepPropTypes;

SetupStep.defaultProps = {
  step: undefined,
};

export default SetupStep;
