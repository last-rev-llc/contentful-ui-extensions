import React from "react";
import PropTypes from "prop-types";
import {
  Form,
  FieldGroup,
  FormLabel,
  TextInput,
  Select,
  Option,
  Button,
} from "@contentful/forma-36-react-components";
import SectionWrapper from "../SectionWrapper";

const CreateFormPropTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const CreateForm = ({ type, name, onChange, onSubmit }) => {
  return (
    <SectionWrapper title="General">
      <Form onSubmit={onSubmit}>
        <FieldGroup>
          <FormLabel htmlFor="type">Form Type</FormLabel>
          <Select
            required
            id="type"
            name="type"
            value={type}
            onChange={onChange("type")}
          >
            <Option value="custom">Custom</Option>
            <Option value="hubspot">Hubspot</Option>
          </Select>
          <FormLabel htmlFor="name">Form Name</FormLabel>
          <TextInput
            required
            name="name"
            id="name"
            value={name}
            onChange={onChange("name")}
          />
        </FieldGroup>
        <FieldGroup>
          <div className="create-form-actions">
            <Button type="submit" size="small">
              Save
            </Button>
          </div>
        </FieldGroup>
      </Form>
    </SectionWrapper>
  );
};

CreateForm.propTypes = CreateFormPropTypes;

CreateForm.defaultProps = {};

export default CreateForm;
