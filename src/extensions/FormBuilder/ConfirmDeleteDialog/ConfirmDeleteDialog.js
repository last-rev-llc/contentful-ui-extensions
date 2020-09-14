import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  FieldGroup,
  FormLabel,
  TextInput,
  Form,
  Button,
} from "@contentful/forma-36-react-components";

const ConfirmDeleteDialogPropTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const ConfirmDeleteDialog = ({ item, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(false);

  const handleChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  useEffect(() => {
    if (item && item.title === name) setEnabled(true);
    else setEnabled(false);
  }, [item, name]);

  useEffect(() => {
    if (!item) setName("");
  }, [item]);

  if (!item) return null;
  return (
    <Modal title={`Delete ${item.title}`} isShown onClose={onClose}>
      To delete <strong>{item.title}</strong> please type the name
      <Form onSubmit={onSubmit} className="confirm-delete-dialog-form">
        <FieldGroup>
          <FormLabel htmlFor="name">Step Name</FormLabel>
          <TextInput
            autoFocus
            required
            name="name"
            id="name"
            value={name}
            onChange={handleChange}
          />
        </FieldGroup>
        <FieldGroup>
          <div className="confirm-delete-dialog-actions">
            <Button
              type="submit"
              disabled={!enabled}
              buttonType="negative"
              size="small"
            >
              Delete
            </Button>
            <Button
              size="small"
              onClick={onClose}
              className="confirm-delete-dialog-button"
            >
              Cancel
            </Button>
          </div>
        </FieldGroup>
      </Form>
    </Modal>
  );
};

ConfirmDeleteDialog.propTypes = ConfirmDeleteDialogPropTypes;

ConfirmDeleteDialog.defaultProps = {
  item: undefined,
};

export default ConfirmDeleteDialog;
