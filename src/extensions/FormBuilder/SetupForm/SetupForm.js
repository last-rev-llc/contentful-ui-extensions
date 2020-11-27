import React from 'react';
import styled from 'styled-components';
import arrayMove from 'array-move';
import PropTypes from 'prop-types';
import { curry } from 'lodash/fp';
import { Button, IconButton, SectionHeading } from '@contentful/forma-36-react-components';

import FieldModal from './FieldModal';
import SectionWrapper from '../SectionWrapper';
import SortableList from '../SortableList';
import { buildField } from '../utils';
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
  justify-content: space-between;
`;

const TypeText = styled.span`
  color: #aaaaaa;
`;

function getModal(sdk) {
  const { modal } = sdk.parameters.invocation || {};
  return modal;
}

function SetupForm({ stepConfig }) {
  const { steps, stepAdd, stepRemove, stepEdit, stepReorder } = stepConfig;
  const sdk = useSDK();

  const handleFieldRemove = curry((stepId, field) =>
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

  const handleFieldAdd = curry((stepId, _event) =>
    stepEdit(stepId, (oldStep) => ({
      ...oldStep,
      fields: oldStep.fields.concat(buildField())
    }))
  );

  const handleFieldUpdate = curry((stepId, newField) =>
    stepEdit(stepId, (oldStep) => ({
      ...oldStep,
      fields: oldStep.fields.map((field) => (field.id === newField.id ? newField : field))
    }))
  );

  const fieldReorder = curry((stepId, { oldIndex, newIndex }) =>
    // Move the item to position requested
    stepEdit(stepId, (step) => ({ ...step, fields: arrayMove(step.fields, oldIndex, newIndex) }))
  );

  const showModal = curry((modalName, parameters) =>
    sdk.dialogs.openExtension({
      width: 500,
      id: sdk.ids.extension,
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      position: 'center',
      parameters: {
        modal: modalName,
        ...parameters
      }
    })
  );

  switch (getModal(sdk)) {
    case 'field-modal':
      return <FieldModal />;

    default:
      break;
  }

  return (
    <SectionWrapper title="Setup Form">
      <div className="setup-form">
        <SectionHeading className="title">Steps</SectionHeading>
        <SortableList items={steps} onSortEnd={stepReorder} onRemoveItem={stepRemove} onEditItem={stepEdit}>
          {(step) => (
            <Col>
              <SortableList
                onClickEdit
                items={step.fields}
                onSortEnd={fieldReorder(step.id)}
                onEditItem={(field) =>
                  showModal('field-modal', field)
                    // When the user clicks save in the modal we'll get the new field back
                    // orr null if the user clicks cancel
                    .then(({ field: newField } = {}) => newField && handleFieldUpdate(step.id, newField))
                }
                onRemoveItem={handleFieldRemove(step.id)}
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
                label="Hello"
                onClick={handleFieldAdd(step.id)}
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

SetupForm.propTypes = {
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

SetupForm.defaultProps = {};

export default SetupForm;
