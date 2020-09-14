import React from "react";
import PropTypes from "prop-types";
import { SectionHeading, Button } from "@contentful/forma-36-react-components";
import SectionWrapper from "../SectionWrapper";
import SortableList from "../SortableList";

const SetupFormPropTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAddStep: PropTypes.func.isRequired,
  onRemoveStep: PropTypes.func.isRequired,
  onEditStep: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
};

const SetupForm = ({
  steps,
  onAddStep,
  onRemoveStep,
  onEditStep,
  onSortEnd,
}) => {
  return (
    <SectionWrapper title="Setup Form">
      <div className="setup-form">
        <SectionHeading className="title">Steps</SectionHeading>
        <SortableList
          items={steps}
          onSortEnd={onSortEnd}
          onRemoveItem={onRemoveStep}
          onEditItem={onEditStep}
        />
        <div className="actions">
          <Button onClick={onAddStep} size="small">
            Add Step
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
};

SetupForm.propTypes = SetupFormPropTypes;

SetupForm.defaultProps = {};

export default SetupForm;
