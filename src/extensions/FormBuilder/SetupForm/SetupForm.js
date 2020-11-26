import React from 'react';
import PropTypes from 'prop-types';
import { SectionHeading, Button } from '@contentful/forma-36-react-components';
import SectionWrapper from '../SectionWrapper';
import SortableList from '../SortableList';

const SetupFormPropTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  stepAdd: PropTypes.func.isRequired,
  stepRemove: PropTypes.func.isRequired,
  stepEdit: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired
};

function SetupForm({ steps, stepAdd, stepRemove, stepEdit, onSortEnd }) {
  return (
    <SectionWrapper title="Setup Form">
      <div className="setup-form">
        <SectionHeading className="title">Steps</SectionHeading>
        <SortableList items={steps} onSortEnd={onSortEnd} onRemoveItem={stepRemove} onEditItem={stepEdit} />
        <div className="actions">
          <Button onClick={stepAdd} size="small">
            Add Step
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

SetupForm.propTypes = SetupFormPropTypes;

SetupForm.defaultProps = {};

export default SetupForm;
