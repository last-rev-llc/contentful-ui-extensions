import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, FieldGroup, Form, TextField } from '@contentful/forma-36-react-components';

function EditForm({ value, onSubmit, onCancel }) {
  const [period, setPeriod] = useState('');
  const [description, setDescription] = useState('');

  function clearData() {
    setPeriod('');
    setDescription('');
  }

  useEffect(() => {
    if (value) {
      setPeriod(value.period);
      setDescription(value.description);
    } else {
      clearData();
    }
  }, [value]);

  function submit() {
    onSubmit({ period, description });
  }

  return (
    <>
      <Card className="operatingHours__newRowCard">
        <Form
          onSubmit={submit}
          className="operatingHours__newRowForm">
          <div className="operatingHours__newRowFormFields">
            <FieldGroup>
              <TextField
                id="period"
                name="period"
                labelText="Period"
                value={period}
                onChange={e => setPeriod(e.target.value)}
                required />
            </FieldGroup>
            <FieldGroup>
              <TextField
                id="description"
                name="description"
                labelText="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required />
            </FieldGroup>
          </div>
          {
            value ? (
              <>
                <Button
                  buttonType="primary"
                  type="submit">
                  Save Edit
                </Button>
                <Button
                  buttonType="muted"
                  type="button"
                  onClick={onCancel}
                  className="operatingHours__cancelButton">
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                buttonType="primary"
                type="submit">
                Add Friendly Label
              </Button>
            )
          }
        </Form>
      </Card>
    </>
  );
}

EditForm.propTypes = {
  value: PropTypes.shape({
    period: PropTypes.string,
    description: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

EditForm.defaultProps = {
  value: null
};

export default EditForm;
