import React from 'react';
import styled from 'styled-components';
import arrayMove from 'array-move';
import PropTypes from 'prop-types';
import { curry } from 'lodash/fp';
import { Button, IconButton, SectionHeading } from '@contentful/forma-36-react-components';

import SectionWrapper from '../SectionWrapper';
import SortableList from '../SortableList';
import { buildField, showModal } from '../utils';
import { useSDK } from '../../../context';

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const LeftIconButton = styled(IconButton)`
  margin-top: 8px;
  span {
    justify-content: flex-start;
  }
`;

const FieldDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TypeText = styled.span`
  background-color: #fafafa;
  padding: 8px;
`;

function useFieldsConfig(stepEdit) {
  const fieldRemove = curry((stepId, field) =>
    stepEdit(
      stepId,

      // Filter out the step
      // we're passing a function to stepEdit which will give us
      // the latest version of the step (actomic update)
      (oldStep) => ({
        ...oldStep,
        fields: oldStep.fields.filter(({ id: fieldId }) => fieldId !== field.id)
      })
    )
  );

  // We want to keep this function curried so we
  // must provide a second argument (for lodash)
  // eslint-disable-next-line no-unused-vars
  const fieldAdd = curry((stepId, _event) =>
    stepEdit(stepId, (oldStep) => ({
      ...oldStep,
      fields: oldStep.fields.concat(buildField())
    }))
  );

  const fieldUpdate = curry((stepId, newField) =>
    stepEdit(stepId, (oldStep) => ({
      ...oldStep,
      fields: oldStep.fields.map((field) => (field.id === newField.id ? newField : field))
    }))
  );

  const fieldReorder = curry((stepId, { oldIndex, newIndex }) =>
    // Move the item to position requested
    stepEdit(stepId, (step) => ({ ...step, fields: arrayMove(step.fields, oldIndex, newIndex) }))
  );

  return {
    fieldAdd,
    fieldRemove,
    fieldUpdate,
    fieldReorder
  };
}

function StepList({ stepConfig }) {
  const sdk = useSDK();

  const { steps, stepAdd, stepRemove, stepEdit, stepReorder } = stepConfig;
  const { fieldAdd, fieldRemove, fieldUpdate, fieldReorder } = useFieldsConfig(stepEdit);

  return (
    <SectionWrapper title="Setup Form">
      <div className="setup-form">
        <SectionHeading className="title">Steps</SectionHeading>
        <SortableList
          items={steps}
          onSortEnd={stepReorder}
          onRemoveItem={stepRemove}
          onEditItem={(step) =>
            showModal(sdk, 'step-modal', step)
              // If the modal returned us a new step we'll update the values in our current state
              // The modal is stateless so it's not changing our step directly
              .then(({ step: newStep } = {}) => newStep && stepEdit(step.id, newStep))
          }>
          {(step) => (
            <Col>
              <SortableList
                items={step.fields}
                onSortEnd={fieldReorder(step.id)}
                onEditItem={(field) =>
                  showModal(sdk, 'field-modal', field)
                    // When the user clicks save in the modal we'll get the new field back
                    // orr null if the user clicks cancel
                    .then(({ field: newField } = {}) => newField && fieldUpdate(step.id, newField))
                }
                onRemoveItem={fieldRemove(step.id)}
                renderItem={(field) => (
                  <FieldDisplay>
                    <span>{field.name}</span>
                    <TypeText>{field.type}</TypeText>
                  </FieldDisplay>
                )}
              />
              <LeftIconButton
                size="small"
                buttonType="primary"
                label="Add new field"
                onClick={fieldAdd(step.id)}
                iconProps={{ icon: 'PlusCircle' }}
              />
            </Col>
          )}
        </SortableList>
        <div className="actions">
          <Button onClick={stepAdd} size="small">
            Add Step
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

StepList.propTypes = {
  stepConfig: PropTypes.shape({
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
      })
    ),
    stepAdd: PropTypes.func,
    stepRemove: PropTypes.func,
    stepEdit: PropTypes.func,
    stepReorder: PropTypes.func
  }).isRequired
};

StepList.defaultProps = {};

export default StepList;
